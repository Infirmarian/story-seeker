from enum import Enum
from .. import db
from sqlalchemy import Column


class AccessLevel(Enum):
    user = 0
    moderator = 1
    admin = 2


class Genre(Enum):
    horror = 0
    comedy = 1
    adventure = 2
    fantasy = 3
    science_fiction = 4
    western = 5
    romance = 6
    mystery = 7
    detective = 8
    dystopia = 9
    NA = 10


class Rating(Enum):
    NR = 0
    G = 1
    PG = 2
    PG_13 = 3
    R = 4


class PublicationStatus(Enum):
    not_published = 0
    unlisted = 1
    pending = 2
    published = 3


class ReadingType(Enum):
    subscribed = 0
    owned = 1
