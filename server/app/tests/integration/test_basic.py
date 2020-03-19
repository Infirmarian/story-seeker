from app.tests import client


def test_index():
    result = client.get('/')
    assert result.status_code == 200


def test_robots_txt():
    result = client.get('/robots.txt')
    assert result.status_code == 200
    print(result.data.decode('utf8'))
    with open('static/robots.txt') as f:
        l = f.read()
    assert l == result.data.decode('utf8')
