const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
require("jest-sorted");
/* Set up your beforeEach & afterAll functions here */

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET: /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET: /api/topics", () => {
  test("200: Responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
  test("404: endpoint not available", () => {
    return request(app)
      .get("/api/snails")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route Not Found");
      });
  });
});
describe("GET: request with parametric endpoint", () => {
  test("200: Responds with an array of topics", () => {
    return request(app)
      .get("/api/article/1")
      .expect(200)
      .then((response) => {
        const articles = response.body.article;
        articles.map((article) => {
          expect(article.article_id).toEqual(1);
          expect(typeof article.title).toEqual("string");
          expect(typeof article.body).toEqual("string");
          expect(typeof article.author).toEqual("string");
          expect(typeof article.created_at).toEqual("string");
          expect(typeof article.votes).toEqual("number");
          expect(typeof article.article_img_url).toEqual("string");
        });
      });
  });
  test("404: Responds with an error message when the correct data type is requested but is currently non existent", () => {
    return request(app)
      .get("/api/article/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("400: Responds with a bad request when a non suitable input request is made i.e not a number", () => {
    return request(app)
      .get("/api/article/abde")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request, not a valid input");
      });
  });
});
describe("GET: /api/articles", () => {
  test("200:responds with an articles array of article objects ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const body = response.text;
        const articleArray = JSON.parse(body);
        expect(Array.isArray(articleArray)).toBe(true);
        const expectedArticleShape = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        };

        articleArray.forEach((article) => {
          expect(article).toMatchObject(expectedArticleShape);
        });
      });
  });
  test("200:check if array is ordered in DESC order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const body = response.text;
        const articelArray = JSON.parse(body);
        expect(articelArray.map((a) => a.created_at)).toBeSorted({
          descending: true,
        });
      });
  });
});
describe("GET: /api/articles/:article_id/comments", () => {
  test("200:responds with an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const body = response.text;
        const commentArray = JSON.parse(body);
        const expected = {
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        };
        commentArray.forEach((comment) => {
          expect(comment).toMatchObject(expected);
        });
        expect(Array.isArray(commentArray)).toBe(true);
      });
  });
  test("404:responds with an error, this article_id does not exist yet", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("this article id does not exist yet");
      });
  });
  test("200:valid input, with a recognised id, but reponds with empty array and appropiate message", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe(
          "this article does not have any comments"
        );
        expect(response.body.comments).toEqual([]);
      });
  });
});
describe("POST: /api/articles/:article_id/comments", () => {
  test("201:responds with an object, a comment with properties of username and body", () => {
    const newComment = {
      username: "butter_bridge",
      body: "60% of the time it works every time",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            username: newComment.username,
            body: newComment.body,
          })
        );
      });
  });
  test("404:responds with an error, this article_id does not exist yet", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("this article id does not exist yet");
      });
  });
  test("404:responds with an error, this username does not exist yet", () => {
    const newComment = {
      username: "RonBurgundy",
      body: "60% of the time it works every time",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        console.log(response.body.msg);
        expect(response.body.msg).toBe(
          "Sorry, but this username doesn't exist."
        ); //PLEASE CAN YOU LOOK AT THIS, IT RAMDONLY FAIS I CAN RUN IT 10 TIMES AND IT NOT FAIL, IT FAILS I RUN IT AGAIN AND IT PASSES
      });
  });
});

describe("PATCH: REQUEST/api/articles/:article_id", () => {
  test("200: update the votes in articles (+)", () => {
    const newVote = { inc_votes: 1 };
    const expectedArticle1 = {
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: 101,
      article_img_url: expect.any(String),
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject(expectedArticle1);
        expect(response.body.votes).toBe(101);
      });
  });
  test("200: update the votes in articles (-)", () => {
    const newVote = { inc_votes: -1 };
    const expectedArticle1 = {
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: 100,
      article_img_url: expect.any(String),
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject(expectedArticle1);
        expect(response.body.votes).toBe(100); // i have put 100 as the test before simulates an increase in articled 1
      });
  });
  test("400: not a valid vote input", () => {
    const newVote = { inc_votes: "a" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "bad request: not a valid vote input, try again"
        );
      });
  });
});
describe("DELETE: /api/comments/:comment_id", () => {
  test("204: deleting a comment with a given id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: if the id doesnt exist or in this case has already been deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Sorry, but this Id doesn't exist.");
      });
  });
});
describe("GET: /api/users", () => {
  test("200: respons with an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        users.map((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
          expect(Object.keys(user)).toEqual(
            expect.arrayContaining(["username", "name", "avatar_url"])
          );
          expect(Object.keys(user)).toHaveLength(3);
        });
      });
  });
});
describe("GET /api/articles - sorting queries", () => {
  test("200: SORT_BY. default = sorted_by created_at date / DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order_by=DESC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.created_at)).toBeSorted({
          descending: true,
        });
      });
  });
  test("200: SORT_BY. default = sorted_by created_at date / ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order_by=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.created_at)).toBeSorted({
          descending: false,
        });
      });
  });
  test("200: SORT_BY. = sorted_by title / DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order_by=DESC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.title)).toBeSorted({
          descending: true,
        });
      });
  });
  test("200: SORT_BY. = sorted_by title / ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order_by=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.title)).toBeSorted({
          descending: false,
        });
      });
  });
  test("200: SORT_BY. = sorted_by topic / DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order_by=DESC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.topic)).toBeSorted({
          descending: true,
        });
      });
  });
  test("200: SORT_BY. = sorted_by topic / ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order_by=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.topic)).toBeSorted({
          descending: false,
        });
      });
  });
  test("200: SORT_BY. = sorted_by article_img_url / DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url&order_by=DESC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.article_img_url)).toBeSorted({
          descending: true,
        });
      });
  });
  test("200: SORT_BY. = sorted_by article_img_url / ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url&order_by=ASC")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.map((a) => a.article_img_url)).toBeSorted({
          descending: false,
        });
      });
  });
  // test("200: SORT_BY. = sorted_by votes", () => {
  //   return request(app)
  //     .get("/api/articles?sort_by=votes")
  //     .expect(200)
  //     .then((response) => {
  //       const articles = response.body;
  //       expect(articles.map((a) => a.votes)).toBeSorted({
  //         descending: true,
  //       });
  //     });
  // });
  // test("200: SORT_BY. = sorted_by comment_count", () => {
  //   return request(app)
  //     .get("/api/articles?sort_by=comment_count")
  //     .expect(200)
  //     .then((response) => {
  //       const articles = response.body;
  //       expect(articles.map((a) => a.comment_count)).toBeSorted({
  //         descending: true,
  //       });
  //     });
  // });
  // test("200: SORT_BY. = sorted_by article_id", () => {
  //   return request(app)
  //     .get("/api/articles?sort_by=article_id")
  //     .expect(200)
  //     .then((response) => {
  //       const articles = response.body;
  //       expect(articles.map((a) => a.article_id)).toBeSorted({
  //         descending: true,
  //       });
  //     });
  // });
  // test("200: SORT_BY. = sorted_by author", () => {
  //   return request(app)
  //     .get("/api/articles?sort_by=author")
  //     .expect(200)
  //     .then((response) => {
  //       const articles = response.body;
  //       expect(articles.map((a) => a.author)).toBeSorted({
  //         descending: true,
  //       });
  //     });
  // });
  // test("200: ORDER_BY. default = sorted_by author", () => {
  //   return request(app)
  //     .get("/api/articles?sort_by=author")
  //     .expect(200)
  //     .then((response) => {
  //       const articles = response.body;
  //       expect(articles.map((a) => a.author)).toBeSorted({
  //         descending: true,
  //       });
  //     });
  // });
});
