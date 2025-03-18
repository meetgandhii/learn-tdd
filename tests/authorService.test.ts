import app from "../server";
import request from "supertest";
import Author from "../models/author";

describe("Verify GET /authors", () => {
    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it("should respond with a sorted list of author names and lifetimes", async () => {
        const mockAuthors = [
            "Doe, John : 1980 - 2020",
            "Smith, Jane : 1990 - "
        ];
        Author.getAllAuthors = jest.fn().mockResolvedValue(mockAuthors);

        const response = await request(app).get("/authors");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockAuthors);
        expect(Author.getAllAuthors).toHaveBeenCalledWith({ family_name: 1 });
    });

    it("should respond with 'No authors found' when there are no authors", async () => {
        Author.getAllAuthors = jest.fn().mockResolvedValue([]);

        const response = await request(app).get("/authors");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("No authors found");
    });

    it("should respond with 'No authors found' when there is an error processing the request", async () => {
        Author.getAllAuthors = jest.fn().mockRejectedValue(new Error("Database error"));

        const response = await request(app).get("/authors");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("No authors found");
        expect(consoleSpy).toHaveBeenCalled();
    });
});
