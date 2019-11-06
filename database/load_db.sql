-- Story Seeker
CREATE SCHEMA IF NOT EXISTS ss;
CREATE TYPE ss.category AS ENUM('horror', 'comedy', 'adventure');

CREATE TABLE IF NOT EXISTS ss.authors(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS ss.stories(
    id SERIAL PRIMARY KEY,
    title VARCHAR(128),
    authorid SERIAL,
    content JSON NOT NULL,
    price SMALLINT NOT NULL, --Credits
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (authorid) REFERENCES ss.authors(id)
);

CREATE TABLE IF NOT EXISTS ss.users(
    id VARCHAR(256) PRIMARY KEY,
    tokens INT NOT NULL DEFAULT 0,
    joined TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ss.categories(
    storyid SERIAL,
    category ss.category,
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
    acquire_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    been_read BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (userid) REFERENCES ss.users (id),
    FOREIGN KEY (storyid) REFERENCES ss.stories(id),
    PRIMARY KEY (userid, storyid)
);

CREATE TABLE IF NOT EXISTS ss.saved_state(
    userid VARCHAR(256) PRIMARY KEY,
    current_state JSON NOT NULL,
    FOREIGN KEY (userid) REFERENCES ss.users(id)
);


REVOKE ALL ON ALL TABLES IN SCHEMA ss FROM lambda;
GRANT USAGE ON SCHEMA ss TO lambda;
GRANT SELECT ON ss.saved_state TO lambda;
GRANT UPDATE ON ss.saved_state TO lambda;
GRANT INSERT ON ss.saved_state TO lambda;
GRANT DELETE ON ss.saved_state TO lambda;
GRANT SELECT ON ss.users TO lambda;
GRANT UPDATE ON ss.users TO lambda;
GRANT INSERT ON ss.users TO lambda;

GRANT SELECT ON ss.libraries TO lambda;
GRANT SELECT ON ss.stories TO lambda;
