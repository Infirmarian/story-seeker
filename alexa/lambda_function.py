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
LISTING = 6

class LaunchRequestHandler(AbstractRequestHandler):
    """Handler for Skill Launch."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("LaunchRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        uid = handler_input.request_envelope.context.system.user.user_id
        database.add_user(uid)
        response = 'Welcome to Story Seeker! To begin a story, say "Tell me [story name]". For more things I can do, say "Help"'
        re_prompt = 'For assistance, say "Help"'
        return (
            handler_input.response_builder
                .speak(response)
                .ask(re_prompt)
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
            question = 'It looks like you don\'t own %s. To add it to your library, say "Get %s".' % (story.name, story.name)
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
        input_digit = int(utils.get_resolved_value(handler_input, 'answer_number'))
        result = utils.select_option(attr, input_digit)
        if attr.get('STATE') == STORY_ENDED:
            reprompt = 'Do you want to try the story again?'
        else:
            reprompt = utils.get_question(attr)
        
        return handler_input.response_builder.speak(result).ask(reprompt).response

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
        reprompt = 'What do you want to do now?'
        return handler_input.response_builder.speak(output+reprompt).ask(reprompt).response

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
        
        if len(lib) == 0:
            output = 'It looks like you don\'t own any stories. To find some, say "Search for stories"'
        else:
            output = 'You own %s. To start one, say "Tell me [story title]"' % utils.format_list(lib[0:3])
        if len(lib) > 3:
            output += 'Do you want to list more?'
            attr['STATE'] = LISTING
            attr['LIST'] = {'list': lib, 'pos': 3}
            return handler_input.response_builder.speak(output).ask('Do you want to list more?').response
        else:
            return handler_input.response_builder.speak(output).ask('What do you want to do now?').response

class ContinueListIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.YesIntent')(handler_input) and attr.get('STATE') == LISTING
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        lvalues = attr['LIST']
        if len(lvalues['list']) < lvalues['pos'] + 4:
            response = ', '.join(lvalues['list'][lvalues['pos']:])
            reprompt = 'What do you want to do now?'
        else:
            response = ', '.join(lvalues['list'][lvalues['pos']:lvalues['pos']+3])
            response += 'Do you want more?'
            reprompt = 'Do you want to list more?'
            attr['LIST']['pos'] = lvalues['pos'] +3;
        return handler_input.response_builder.speak(response).ask(reprompt).response

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
            result = 'You have %d credit%s. To get a story, say \'Get [Story Title]\'' % (num_credits, '' if num_credits == 1 else 's')
        return handler_input.response_builder.speak(result).ask(result).response

class PurchaseInitiationIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('PurchaseQuery')(handler_input)
    def handle(self, handler_input):
        uid = handler_input.request_envelope.context.system.user.user_id
        items = utils.in_skill_product_response(handler_input)
        if items:
            purchasable = [l for l in items.in_skill_products
                           if #l.entitled == EntitledState.NOT_ENTITLED and
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
        uid = handler_input.request_envelope.context.system.user.user_id
        in_skill_response = utils.in_skill_product_response(handler_input)
        product_id = handler_input.request_envelope.request.payload.get("productId")
        if in_skill_response:
            product = [l for l in in_skill_response.in_skill_products
                       if l.product_id == product_id]
            if handler_input.request_envelope.request.status.code == "200":
                purchase_result = handler_input.request_envelope.request.payload.get("purchaseResult")
                result = ''
                if purchase_result == PurchaseResult.ACCEPTED.value:
                    add_tokens = 0
                    if product[0].reference_name == 'story_token_1':
                        database.add_user_balance(uid, 1)
                    elif product[0].reference_name == 'story_token_5':
                        database.add_user_balance(uid, 1)
                    new_balance = database.get_user_balance(uid)
                    if new_balance:
                        result = 'You now have %d token%s. To get a story, say \'Get [Story Title]\'' % (new_balance, '' if new_balance == 1 else 's')
                        reprompt = 'What can I help you with?'
                elif purchase_result in (PurchaseResult.DECLINED.value,
                        PurchaseResult.ERROR.value,
                        PurchaseResult.NOT_ENTITLED.value):
                    result = 'Thank you for your interest in %s.' % product[0].name
                    reprompt = 'What can I help you with?'
                return handler_input.response_builder.speak(result).ask(reprompt).response
            else:
                return handler_input.response_builder.speak('There was an issue with your purchase request. Please try again or contact us for help').response

class ProductDescriptionIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('ProductSummary')(handler_input)
    def handle(self, handler_input):
        in_skill_response = utils.in_skill_product_response(handler_input)
        if in_skill_response:
            product_id = utils.get_resolved_id(handler_input, 'product')
            if product_id is None:
                return handler_input.response_builder.speak('I couldn\'t find that product.').ask('I didn\'t get that, can you try again?').response
            products = [l for l in in_skill_response.in_skill_products if l.reference_name == product_id]
            speech = ("%s.  To buy it, say Buy %s" % (products[0].summary, products[0].name))
            reprompt = "I didn't catch that. To buy %s, say Buy %s" % (products[0].name, products[0].name)
            return handler_input.response_builder.speak(speech).ask(reprompt).response
        return handler_input.response_builder.speak('I couldn\'t find that product. To list products, say \'What can I buy?\'').response

class GetStoryIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('GetStory')(handler_input)
    def handle(self, handler_input):
        uid = handler_input.request_envelope.context.system.user.user_id
        title = utils.get_resolved_value(handler_input, 'story')
        storyid = utils.get_resolved_id(handler_input, 'story')
        result = database.purchase_book(uid, storyid)
        attr = handler_input.attributes_manager.session_attributes
        attr['STATE'] = NONE
        if result == 'Insufficient Funds':
            return handler_input.response_builder.speak('''You don't have any tokens in your account. 
            To see what token packs you can buy, say 'What can I buy?'. ''').response
        elif result == 'Already Owned':
            return handler_input.response_builder.speak(
                'You already own %s. To listen to %s, say \'Tell me %s\'. To find another story, say \'Search For Stories\'. You can specify a genre, rating and author.' % 
                (title, title, title)).response
        else:
            return handler_input.response_builder.speak('%s has been added to your library! To listen to it, say \'Tell me %s\'' % (title, title)).response

class SummarizeStoryIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('SummarizeStory')(handler_input)
    def handle(self, handler_input):
        storyid = utils.get_resolved_id(handler_input, 'story')
        story_title = utils.get_resolved_value(handler_input, 'story')
        summary = database.get_summary(storyid)
        if summary:
            return handler_input.response_builder.speak('%s. To get this story, say "Get %s"' % (summary, story_title)).ask('What can I help with?').response
        else:
            return handler_input.response_builder.speak('It doesn\'t look like %s has a summary available' % story_title).ask('What can I help with?').response

class SearchStoriesIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('SearchStories')(handler_input)
    def handle(self, handler_input):
        uid = handler_input.request_envelope.context.system.user.user_id
        author = utils.get_resolved_id(handler_input, 'author')
        genre = utils.get_resolved_id(handler_input, 'genre')
        rating = utils.get_resolved_id(handler_input, 'rating')
        stories = database.search(uid, author, genre, rating)
        if len(stories) == 0:
            response = "I couldn't find any stories matching those criteria that you don't already own. Try some less specific options"
            reprompt = "What do you want to do?"
        else:
            response = 'I found %s. To get more info about a story, say "Summarize [story title]". To add one to your library, say "Get [story title]. ' % utils.format_list(stories[0:3])
            reprompt = 'What do you want to do?'
            if len(stories) > 3:
                response += 'Do you want to list more?'
                attr['STATE'] = LISTING
                attr['LIST'] = {'list': stories, 'pos': 3}
                reprompt = 'Do you want to list more?'
        return handler_input.response_builder.speak(response).ask(reprompt).response

class HelpIntentHandler(AbstractRequestHandler):
    """Handler for Help Intent."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("AMAZON.HelpIntent")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speak_output = '''To start a story, say "Tell me [story title]". 
                            To see what stories you own, you can say "What stories do I have?".
                            If you want to find a story to get, say "Search for stories". You can specify a genre, rating or author.
                            To check your balance of story tokens, ask "What is my balance", and to see what token packs are available,
                            ask "What can I buy"'''
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
sb.add_request_handler(ContinueListIntentHandler())
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
sb.add_request_handler(GetStoryIntentHandler())
sb.add_request_handler(SearchStoriesIntentHandler())
sb.add_request_handler(SummarizeStoryIntentHandler())

sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelOrStopIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
#sb.add_request_handler(IntentReflectorHandler()) # make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers

sb.add_exception_handler(CatchAllExceptionHandler())

lambda_handler = sb.lambda_handler()