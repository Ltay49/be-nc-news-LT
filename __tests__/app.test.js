const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const data = require('../db/data/test-data/index')
const seed = require("../db/seeds/seed");
/* Set up your beforeEach & afterAll functions here */

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with an array of topics", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((response) => {
      const topics = response.body.topics
        expect(topics.length).toBe(3);
          topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");;
      });
  });
});
test("404: endpoint not available", () => {
  return request(app)
    .get('/api/snails')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not Found");
    });
});
});
describe("GET request with parametric endpoint", () => {
  test("200: Responds with an array of topics", () => {
    return request(app)
      .get('/api/article/1')
      .expect(200)
      .then((response) => {
      const articles = response.body.article
          articles.map((article) => {
          expect(article.article_id).toEqual(1)
          expect(typeof article.title).toEqual('string');
          expect(typeof article.body).toEqual('string');
          expect(typeof article.body).toEqual('string');
          expect(typeof article.author).toEqual('string')
          expect(typeof article.created_at).toEqual('string')
          expect(typeof article.votes).toEqual('number')
          expect(typeof article.article_img_url).toEqual('string')
          
      });
  });
});
test("404: Responds with an array of topics", () => {
  return request(app)
    .get('/api/articles/999')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not Found");
    });
});
});
