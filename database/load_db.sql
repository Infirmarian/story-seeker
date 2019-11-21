-- Story Seeker
CREATE SCHEMA IF NOT EXISTS ss;
CREATE SCHEMA IF NOT EXISTS a;
CREATE TYPE ss.category AS ENUM('horror', 'comedy', 'adventure');
CREATE TYPE ss.publication_status AS ENUM('not published', 'pending', 'published');

CREATE TABLE IF NOT EXISTS ss.authors(
    userid VARCHAR(256) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(320);
);

CREATE TABLE IF NOT EXISTS ss.stories(
    id SERIAL PRIMARY KEY,
    title VARCHAR(128),
    authorid VARCHAR(256) NOT NULL,
    content JSON NOT NULL,
    serialized_story JSON NOT NULL,
    price SMALLINT NOT NULL, -- Credits
    summary TEXT NOT NULL,
    rating ss.rating NOT NULL,
    genre ss.category,
    published ss.publication_status NOT NULL DEFAULT 'not published',
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (authorid) REFERENCES ss.authors(userid)
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
    storyid INT,
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
/*
CREATE TABLE IF NOT EXISTS a.in_progress_stories(
    authorid INT NOT NULL,
    content JSON NOT NULL,
    id SERIAL PRIMARY KEY,
    storyid INT,
    FOREIGN KEY (authorid) REFERENCES ss.authors (id),
    FOREIGN KEY (storyid) REFERENCES ss.stories (id)
);
*/
CREATE TABLE IF NOT EXISTS a.tokens(
    token VARCHAR(64) NOT NULL PRIMARY KEY,
    userid VARCHAR(256) NOT NULL,
    expiration TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (userid) REFERENCES ss.authors(userid)
);

--CREATE USER lambda WITH PASSWORD '########';
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
GRANT INSERT ON ss.libraries TO lambda;
GRANT SELECT ON ss.stories TO lambda;

--CREATE USER server WITH PASSWORD '########';
REVOKE ALL ON ALL TABLES IN SCHEMA ss FROM server;
GRANT USAGE ON SCHEMA ss TO server;
GRANT USAGE ON SCHEMA a TO server;
GRANT SELECT ON ss.stories TO server;
GRANT INSERT ON ss.stories TO server;
GRANT UPDATE ON ss.stories TO server;
GRANT SELECT ON ss.authors TO server;
GRANT INSERT ON ss.authors TO server;
GRANT SELECT ON a.tokens TO server;
GRANT UPDATE ON a.tokens TO server;
GRANT INSERT ON a.tokens TO server;
GRANT DELETE ON a.tokens TO server;

--CREATE USER catalog WITH PASSWORD '#######';
REVOKE ALL ON ALL TABLES IN SCHEMA ss FROM catalog;
GRANT USAGE ON SCHEMA ss TO catalog;
GRANT SELECT ON ss.authors TO catalog;
GRANT SELECT ON ss.stories TO catalog;

