-- Story Seeker
CREATE SCHEMA IF NOT EXISTS ss;
CREATE TYPE category AS ENUM('horror', 'comedy', 'adventure');

CREATE TABLE IF NOT EXISTS ss.authors(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128),
    last_name VARCHAR(128),
)

CREATE TABLE IF NOT EXISTS ss.stories(
    id SERIAL PRIMARY KEY,
    title VARCHAR(128),
    authorid SERIAL,
    content JSON NOT NULL,
    price NUMERIC(4, 2) NOT NULL,
    created TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (author) REFERENCES ss.authors(id)
);

CREATE TABLE IF NOT EXISTS ss.users(
    id VARCHAR(256) PRIMARY KEY,
    joined TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS ss.categories(
    storyid SERIAL,
    category category,
    FOREIGN KEY (storyid) REFERENCES ss.stories (id),
    PRIMARY KEY(storyid, category)
);

CREATE TABLE IF NOT EXISTS ss.ratings(
    storyid SERIAL,
    userid VARCHAR(256),
    rating SMALLINT NOT NULL,
    CHECK(rating > 0), CHECK(rating < 6),
    PRIMARY KEY (userid, storyid)
);

CREATE TABLE IF NOT EXISTS ss.libraries(
    userid VARCHAR(256),
    storyid SERIAL,
    acquire_date TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (userid) REFERENCES ss.users (id)
    FOREIGN KEY (storyid) REFERENCES ss.stories(id)
);
