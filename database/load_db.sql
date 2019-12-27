-- Story Seeker
CREATE SCHEMA IF NOT EXISTS ss;
CREATE SCHEMA IF NOT EXISTS a;
CREATE TYPE ss.category AS ENUM(
    'horror',
    'comedy',
    'adventure',
    'fantasy',
    'science fiction',
    'western',
    'romance',
    'mystery',
    'detective',
    'dystopia');
CREATE TYPE ss.rating AS ENUM('G', 'PG', 'PG-13', 'R', 'NR');
CREATE TYPE ss.publication_status AS ENUM('not published', 'pending', 'published');
CREATE TYPE ss.reading_type AS ENUM('subscribed', 'owned');
CREATE TYPE a.access_level AS ENUM('user', 'admin');

CREATE TABLE IF NOT EXISTS ss.authors(
    userid VARCHAR(256) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(320),
    paypal VARCHAR(256),
    joined TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ss.stories(
    id SERIAL PRIMARY KEY,
    title VARCHAR(128),
    authorid VARCHAR(256) NOT NULL,
    content JSON,
    serialized_story JSON,
    price SMALLINT NOT NULL DEFAULT 0, -- Credits
    summary TEXT,
    rating ss.rating NOT NULL DEFAULT 'NR',
    genre ss.category,
    published ss.publication_status NOT NULL DEFAULT 'not published',
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_compiled TIMESTAMPTZ NOT NULL DEFAULT 0,
    FOREIGN KEY (authorid) REFERENCES ss.authors(userid)
);

CREATE TABLE IF NOT EXISTS ss.users(
    id VARCHAR(256) PRIMARY KEY,
    tokens INT NOT NULL DEFAULT 0,
    joined TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ss.readings(
    storyid INT,
    userid VARCHAR(256),
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type reading_type NOT NULL,
    FOREIGN KEY (storyid) REFERENCES ss.stories (id),
    FOREIGN KEY (userid) REFERENCES ss.users(id)
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

CREATE TABLE IF NOT EXISTS ss.favorites(
    userid VARCHAR(256),
    storyid INT,
    FOREIGN KEY (userid) REFERENCES ss.users(id),
    FOREIGN KEY (storyid) REFERENCES ss.stories(id),
    PRIMARY KEY (userid, storyid)
);

CREATE TABLE IF NOT EXISTS ss.saved_state(
    userid VARCHAR(256) PRIMARY KEY,
    current_state JSON NOT NULL,
    FOREIGN KEY (userid) REFERENCES ss.users(id)
);

CREATE TABLE IF NOT EXISTS a.tokens(
    token VARCHAR(32) NOT NULL PRIMARY KEY,
    userid VARCHAR(256) NOT NULL,
    expiration TIMESTAMPTZ NOT NULL,
    access_level a.access_level NOT NULL DEFAULT 'user',
    FOREIGN KEY (userid) REFERENCES ss.authors(userid)
);

CREATE TABLE IF NOT EXISTS a.payments(
    authorid VARCHAR(256),
    month TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW()),
    payment NUMERIC(8, 2) NOT NULL DEFAULT 0,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (authorid) REFERENCES ss.authors(userid),
    PRIMARY KEY (authorid, month)
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
GRANT INSERT ON ss.readings TO lambda;

--CREATE USER server WITH PASSWORD '########';
REVOKE ALL ON ALL TABLES IN SCHEMA ss FROM server;
GRANT USAGE ON SCHEMA ss TO server;
GRANT USAGE ON SCHEMA a TO server;
GRANT SELECT ON ss.stories TO server;
GRANT INSERT ON ss.stories TO server;
GRANT UPDATE ON ss.stories TO server;
GRANT DELETE ON ss.stories TO server;
GRANT USAGE, SELECT ON SEQUENCE ss.stories_id_seq TO server; -- Needed to update sequencing
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
