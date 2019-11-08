# Copyright Robert Geil 2019
import logging
import ask_sdk_core.utils as ask_utils

from ask_sdk_core.skill_builder import CustomSkillBuilder
from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.dispatch_components import AbstractExceptionHandler
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_core.api_client import DefaultApiClient
from ask_sdk_model.services.monetization import (
    EntitledState, PurchasableState, InSkillProductsResponse, Error,
    InSkillProduct)
from ask_sdk_core.utils import is_request_type, is_intent_name

from ask_sdk_model.interfaces.monetization.v1 import PurchaseResult
from ask_sdk_model.interfaces.connections import SendRequestDirective
from ask_sdk_model import Response

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
import utils
import database
from PSQLAdapter import PSQLAdapter
from enum import Enum

# States
NONE = 0
STORY = 1
STORY_ENDED = 2
REVIEW_PENDING = 3
REDEEM_TOKEN = 4
PURCHASE_TOKEN = 5


class LaunchRequestHandler(AbstractRequestHandler):
    """Handler for Skill Launch."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("LaunchRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        uid = handler_input.request_envelope.context.system.user.user_id
        database.add_user(uid)
        speak_output = 'Hello world!'
        return (
            handler_input.response_builder
                .speak(speak_output)
                .ask(speak_output)
                .response
        )

class StartStoryIntentHandler(AbstractRequestHandler):
    ''' Handler for beginning a story '''
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('StartStory')(handler_input)
    def handle(self, handler_input):
        uid = handler_input.request_envelope.context.system.user.user_id
        attr = handler_input.attributes_manager.session_attributes
        story = (handler_input.request_envelope.request.intent.slots['stories'].resolutions.resolutions_per_authority[0]
            .values[0].value)
        result = database.load_story_if_possible(uid, story.id)
        if result is None:
            attr['STATE'] = REDEEM_TOKEN
            attr['STORY ID'] = story.id
            question = 'It looks like you don\'t own %s. Do you want to add it to your library?' % story.name
            return handler_input.response_builder.speak(question).ask(question).response
        attr['STORY'] = result
        attr['INDEX'] = 0
        attr['STATE'] = STORY
        response = utils.get_initial(attr)
        reprompt = utils.get_question(attr)
        return handler_input.response_builder.speak(response).ask(reprompt).response

class RepeatQuestionIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('Repeat')(handler_input) and attr.get('STATE') == STORY
        
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        content = utils.get_question(attr)
        return handler_input.response_builder.speak(content).ask(content).response

class SelectPathInStoryIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('Answer')(handler_input) and attr.get('STATE') == STORY
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        input_digit = int(handler_input.request_envelope.request.intent.slots['answer_number'].resolutions
        .resolutions_per_authority[0].values[0].value.name)
        result = utils.select_option(attr, input_digit)
        return handler_input.response_builder.speak(result).ask(result).response

class StoryRepeatIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.YesIntent')(handler_input) and attr['STATE'] == STORY_ENDED
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        attr['INDEX'] = 0
        attr['STATE'] = STORY
        result = utils.get_initial(attr)
        return handler_input.response_builder.speak(result).ask(result).response

class StoryDontRepeatIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.NoIntent')(handler_input) and attr['STATE'] == STORY_ENDED
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        if attr['STORY']['rating'] is None:
            response = 'Do you want to leave a rating?'
            attr['STATE'] = REVIEW_PENDING
        else:
            response = 'What do you want to do?'
            attr['STATE'] = NONE
        return handler_input.response_builder.speak(response).ask(response).response

class AcceptReviewIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.YesIntent')(handler_input) and attr.get('STATE') == REVIEW_PENDING
    def handle(self, handler_input):
        output = 'What is your rating from 1 to 5?'
        return handler_input.response_builder.speak(output).ask(output).response

class InputReviewIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('Answer')(handler_input) and attr.get('STATE') == REVIEW_PENDING
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        input_digit = int(handler_input.request_envelope.request.intent.slots['answer_number'].resolutions
        .resolutions_per_authority[0].values[0].value.name)
        uid = handler_input.request_envelope.context.system.user.user_id
        database.add_rating(uid, attr['STORY']['id'], input_digit)
        output = 'Ok, your rating has been recorded!'
        return handler_input.response_builder.speak(output).ask(output).response

class RejectReviewIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.NoIntent')(handler_input) and attr.get('STATE') == REVIEW_PENDING
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        attr['STATE'] = NONE
        response = 'What do you want to do now?'
        return handler_input.response_builder.speak(response).ask(response).response

class LibraryListingIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('LibraryListing')(handler_input)
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        uid = handler_input.request_envelope.context.system.user.user_id
        lib = attr.get('LIBRARY')
        if lib is None:
            lib = database.get_user_library(uid)
            attr['LIBRARY'] = lib
        output = 'You own %s.' % ', '.join(lib[0:3])
        return handler_input.response_builder.speak(output).response

class CreditSummaryIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('CreditSummary')(handler_input) and attr.get('STATE') != STORY
    def handle(self, handler_input):
        uid = handler_input.request_envelope.context.system.user.user_id
        attr = handler_input.attributes_manager.session_attributes
        num_credits = database.get_user_balance(uid)
        if num_credits == 0:
            result = 'You don\'t have any credits. Would you like to purchase some?'
            attr['STATE'] = PURCHASE_TOKEN
        else:
            result = 'You have %d credits' % num_credits
        return handler_input.response_builder.speak(result).ask(result).response

class PurchaseInitiationIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ((ask_utils.is_intent_name('AMAZON.YesIntent')(handler_input) and attr.get('STATE') == PURCHASE_TOKEN) or 
        ask_utils.is_intent_name('PurchaseQuery')(handler_input))
    def handle(self, handler_input):
        uid = handler_input.request_envelope.context.system.user.user_id
        items = utils.in_skill_product_response(handler_input)
        if items:
            purchasable = [l for l in items.in_skill_products
                           if l.entitled == EntitledState.NOT_ENTITLED and
                           l.purchasable == PurchasableState.PURCHASABLE]
            if len(purchasable) > 0:
                response = '''%s %s available. To purchase something, say \'Buy [Product Name]\'. 
To hear more about a product, say \'Describe [Product Name]. So what can I help you with?''' % (
                    utils.product_format(purchasable), 'are' if len(purchasable) > 1 else 'is')
            else:
                response = 'There aren\'t any items available for you to purchase.'
        reprompt = 'I didn\'t quite get that, could you repeat?'
        return handler_input.response_builder.speak(response).ask(reprompt).response

class BuyRequestIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('BuyIntent')(handler_input)
    def handle(self, handler_input):
        product = utils.get_resolved_id(handler_input, 'product')
        in_skill_response = utils.in_skill_product_response(handler_input)
        if in_skill_response:
            product = [l for l in in_skill_response.in_skill_products
                       if l.reference_name == product]
            return handler_input.response_builder.add_directive(
                    SendRequestDirective(
                        name="Buy",
                        payload={
                            "InSkillProduct": {
                                "productId": product[0].product_id
                            }
                        },
                        token="correlationToken")).response

# TODO
class BuyReturnFromPurchaseIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return (is_request_type("Connections.Response")(handler_input) and handler_input.request_envelope.request.name == "Buy")
    def handle(self, handler_input):
        return handler_input.response_builder.speak('thanks for buying!').response
    
# TODO:
class ProductDescriptionIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('ProductSummary')(handler_input)
    def handle(self, handler_input):
        return handler_input.response_builder.speak('hi').response

class HelpIntentHandler(AbstractRequestHandler):
    """Handler for Help Intent."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("AMAZON.HelpIntent")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speak_output = "You can say hello to me! How can I help?"
        return (
            handler_input.response_builder
                .speak(speak_output)
                .ask(speak_output)
                .response
        )

class CancelOrStopIntentHandler(AbstractRequestHandler):
    """Single handler for Cancel and Stop Intent."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return (ask_utils.is_intent_name("AMAZON.CancelIntent")(handler_input) or
                ask_utils.is_intent_name("AMAZON.StopIntent")(handler_input))

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speak_output = "Goodbye!"

        return (
            handler_input.response_builder
                .speak(speak_output)
                .response
        )


class SessionEndedRequestHandler(AbstractRequestHandler):
    """Handler for Session End."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("SessionEndedRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response

        # Any cleanup logic goes here.

        return handler_input.response_builder.response


class IntentReflectorHandler(AbstractRequestHandler):
    """The intent reflector is used for interaction model testing and debugging.
    It will simply repeat the intent the user said. You can create custom handlers
    for your intents by defining them above, then also adding them to the request
    handler chain below.
    """
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("IntentRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        intent_name = ask_utils.get_intent_name(handler_input)
        speak_output = "You just triggered " + intent_name + "."

        return (
            handler_input.response_builder
                .speak(speak_output)
                # .ask("add a reprompt if you want to keep the session open for the user to respond")
                .response
        )


class CatchAllExceptionHandler(AbstractExceptionHandler):
    """Generic error handling to capture any syntax or routing errors. If you receive an error
    stating the request handler chain is not found, you have not implemented a handler for
    the intent being invoked or included it in the skill builder below.
    """
    def can_handle(self, handler_input, exception):
        # type: (HandlerInput, Exception) -> bool
        return True

    def handle(self, handler_input, exception):
        # type: (HandlerInput, Exception) -> Response
        logger.error(exception, exc_info=True)

        speak_output = "Sorry, I had trouble doing what you asked. Please try again."

        return (
            handler_input.response_builder
                .speak(speak_output)
                .ask(speak_output)
                .response
        )

# The SkillBuilder object acts as the entry point for your skill, routing all request and response
# payloads to the handlers above. Make sure any new handlers or interceptors you've
# defined are included below. The order matters - they're processed top to bottom.

psql_adapter = PSQLAdapter()
api_client = DefaultApiClient()
sb = CustomSkillBuilder(persistence_adapter=psql_adapter, api_client=api_client)

sb.add_request_handler(LaunchRequestHandler())
sb.add_request_handler(StartStoryIntentHandler())
sb.add_request_handler(SelectPathInStoryIntentHandler())
sb.add_request_handler(LibraryListingIntentHandler())
sb.add_request_handler(RepeatQuestionIntentHandler())
sb.add_request_handler(StoryRepeatIntentHandler())
sb.add_request_handler(StoryDontRepeatIntentHandler())
sb.add_request_handler(AcceptReviewIntentHandler())
sb.add_request_handler(RejectReviewIntentHandler())
sb.add_request_handler(InputReviewIntentHandler())
sb.add_request_handler(CreditSummaryIntentHandler())
sb.add_request_handler(PurchaseInitiationIntentHandler())
sb.add_request_handler(BuyRequestIntentHandler())
sb.add_request_handler(BuyReturnFromPurchaseIntentHandler())
sb.add_request_handler(ProductDescriptionIntentHandler())


sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelOrStopIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
sb.add_request_handler(IntentReflectorHandler()) # make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers

sb.add_exception_handler(CatchAllExceptionHandler())

lambda_handler = sb.lambda_handler()