from app.utils.validation import validate_title
import pytest


def test_title_validation():
    with pytest.raises(ValueError):
        assert validate_title('')
    with pytest.raises(ValueError):
        assert validate_title('       ')
    with pytest.raises(ValueError):
        assert validate_title('hello_world')
    with pytest.raises(ValueError):
        assert validate_title(
            'helloworldthis is an incredibly long title and should totally get rejected')
    assert validate_title('  hello  ') == 'hello'
    assert validate_title('  hello    \n world   ') == 'hello world'
