# Copyright Robert Geil 2019
import logging
import ask_sdk_core.utils as ask_utils

from ask_sdk_core.skill_builder import SkillBuilder
from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.dispatch_components import AbstractExceptionHandler
from ask_sdk_core.handler_input import HandlerInput

from ask_sdk_model import Response

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
import utils

class LaunchRequestHandler(AbstractRequestHandler):
    """Handler for Skill Launch."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("LaunchRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speak_output = "Hello world!"
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
        resolution = (handler_input.request_envelope.request.intent.slots['stories'].resolutions.resolutions_per_authority[0]
            .values[0].value)
        return utils.start_story(resolution.id, handler_input, resolution.name)

class RepeatQuestionIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('Repeat')(handler_input) and attr.get('STORY')
        
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        content = attr['CONTENT'][attr['STEP']]
        response = utils.format_options(attr['CONTENT'][attr['STEP']])
        return handler_input.response_builder.speak(response).ask(response).response

class SelectPathInStoryIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('Answer')(handler_input) and attr.get('STATE') == 'STORY'

    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        content = attr['CONTENT']
        current = content[attr['STEP']]
        input_digit = int(handler_input.request_envelope.request.intent.slots['answer_number'].resolutions
        .resolutions_per_authority[0].values[0].value.name)
        if input_digit > len(current['options']):
            return handler_input.response_builder.speak('There are only %d options' % len(current['options'])).response
        next_segment_index = current['options'][input_digit-1][1]
        next_segment = content[next_segment_index]
        if 'options' in next_segment:
            response = '%s %s' % (next_segment['main'], utils.format_options(next_segment))
            attr['STEP'] = next_segment_index
        else:
            # end of the story
            response = '%s. The End. Do you want to try this story again?' % next_segment['main']
            attr['STATE'] = 'STORY_ENDED'
        return handler_input.response_builder.speak(response).ask('Do you want to try this story again?').response

class StoryRepeatIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.YesIntent')(handler_input) and attr['STATE'] == 'STORY_ENDED'
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        
        return utils.start_story(attr['STORY_ID'], handler_input)

class StoryDontRepeatIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.NoIntent')(handler_input) and attr['STATE'] == 'STORY_ENDED'
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        if not utils.user_has_reviewed_product(handler_input.request_envelope.context.system.user.user_id, attr['STORY_ID']):
            response = 'Do you want to leave a rating?'
            attr['STATE'] = 'REVIEW_PENDING'
        else:
            response = 'What do you want to do?'
            attr['STATE'] = None
        return handler_input.response_builder.speak(response).ask(response).response

class AcceptReviewIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('AMAZON.YesIntent')(handler_input) and attr.get('STATE') == 'REVIEW_PENDING'
    def handle(self, handler_input):
        output = 'What is your rating from 1 to 5?'
        return handler_input.response_builder.speak(output).ask(output).response

class RejectReviewIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        return ask_utils.is_intent_name('AMAZON.NoIntent')(handler_input) and attr.get('STATE') == 'REVIEW_PENDING'
    def handle(self, handler_input):
        attr = handler_input.attributes_manager.session_attributes
        attr['STATE'] = None
        response = 'What do you want to do now?'
        return handler_input.response_builder.speak(response).ask(response).response

class LibraryListingIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return ask_utils.is_intent_name('LibraryListing')(handler_input)
    def handle(self, handler_input):
        output = 'I cannot find anything in your library right now'
        return handler_input.response_builder.speak(output).response

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


sb = SkillBuilder()

sb.add_request_handler(LaunchRequestHandler())
sb.add_request_handler(StartStoryIntentHandler())
sb.add_request_handler(SelectPathInStoryIntentHandler())
sb.add_request_handler(LibraryListingIntentHandler())
sb.add_request_handler(RepeatQuestionIntentHandler())
sb.add_request_handler(StoryRepeatIntentHandler())
sb.add_request_handler(StoryDontRepeatIntentHandler())
sb.add_request_handler(AcceptReviewIntentHandler())
sb.add_request_handler(RejectReviewIntentHandler())

sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelOrStopIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
sb.add_request_handler(IntentReflectorHandler()) # make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers

sb.add_exception_handler(CatchAllExceptionHandler())

lambda_handler = sb.lambda_handler()