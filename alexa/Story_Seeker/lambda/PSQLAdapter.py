import database
#from ask_sdk_core.dispatch_components import AbstractPersistenceAdapter

class PSQLAdapter():#AbstractPersistenceAdapter):
    def get_attributes(self, request_envelope):
        # type: (RequestEnvelope) -> Dict[str, Any]
        return database.get_state(request_envelope.context.system.user.user_id)

    def save_attributes(self, request_envelope, attributes):
        # type: (RequestEnvelope, Dict[str, Any]) -> None
        return database.save_state(request_envelope.context.system.user.user_id, attributes)
