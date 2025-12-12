import JSZip from "jszip";
import {
  assertValidType,
  formatFromFilename,
  FORMATS,
  getMimeType,
  init,
  open,
} from "./";
import { test, describe, expect } from "vitest";

test("FORMATS", () => {
  expect(FORMATS).toEqual(["docx", "xlsx", "pptx"]);
});

describe("getMimeType", () => {
  test("valid", () => {
    expect(getMimeType("docx")).toEqual(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(getMimeType("xlsx")).toEqual(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    expect(getMimeType("pptx")).toEqual(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
  });

  test("invalid", () => {
    //@ts-expect-error
    expect(getMimeType("foo")).toEqual(undefined);
  });
});

describe("formatFromFilename", () => {
  test("valid", () => {
    expect(formatFromFilename("./foo/bar/baz.docx")).toEqual("docx");
    expect(formatFromFilename("./foo/bar/baz.pptx")).toEqual("pptx");
    expect(formatFromFilename("./foo/bar/baz.xlsx")).toEqual("xlsx");
  });

  test("invalid", () => {
    expect(() => formatFromFilename("./foo/bar/baz.foobar")).toThrow();
  });
});

describe("assertValidType", () => {
  test("valid", () => {
    expect(assertValidType("docx")).toEqual("docx");
    expect(assertValidType("pptx")).toEqual("pptx");
    expect(assertValidType("xlsx")).toEqual("xlsx");
  });
  test("invalid", () => {
    expect(() => assertValidType("foo")).toThrow();
  });
});

describe("open", () => {
  test("valid", () => {
    const zip = new JSZip();
    open("docx", zip);
    expect(zip.files).toEqual({});
  });

  test("invalid", () => {
    const zip = new JSZip();
    expect(() => {
      // @ts-expect-error
      open("foo", zip);
    }).toThrow();
  });
});
describe("init", () => {
  test("valid", () => {
    const doc = init("docx", {
      test: "foo",
    });
    expect(Object.keys(doc.zip.files)).toEqual(["test"]);
  });

  test("invalid", () => {
    const zip = new JSZip();
    expect(() => {
      // @ts-expect-error
      init("foo", zip);
    }).toThrow();
  });
});

describe("OfficeOpenXml", () => {
  describe("constructor", () => {
    test("valid", () => {});

    test("invalid", () => {});
  });

  test("mimeType", () => {
    const doc1 = init("docx", {});
    expect(doc1.mimeType()).toEqual(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    const doc2 = init("xlsx", {});
    expect(doc2.mimeType()).toEqual(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    const doc3 = init("pptx", {});
    expect(doc3.mimeType()).toEqual(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
  });

  describe("pack", () => {
    test("valid (docx)", async () => {
      const doc = init("docx", { test: "test" });
      const blob = await doc.pack("blob");
      expect(blob.type).toEqual(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
    });
    test("valid (xlsx)", async () => {
      const doc = init("xlsx", { test: "test" });
      const blob = await doc.pack("blob");
      expect(blob.type).toEqual(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
    });
    test("valid (pptx)", async () => {
      const doc = init("pptx", { test: "test" });
      const blob = await doc.pack("blob");
      expect(blob.type).toEqual(
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      );
    });
  });

  describe("unpack", () => {
    test.todo("");
  });

  describe("list", () => {
    test("with files", () => {
      const doc = init("docx", { test: "test" });
      expect(doc.list()).toEqual(["test"]);
    });
    test("no files", () => {
      const doc = init("docx", {});
      expect(doc.list()).toEqual([]);
    });
  });

  describe("readdir", () => {
    test.todo("");
  });

  describe("isDirectory", () => {
    test.todo("");
  });

  describe("mkdir", () => {
    test("new", () => {
      const doc = init("docx", {});
      doc.mkdir("foo");
      expect(Object.keys(doc.zip.files)).toEqual(["foo/"]);
    });

    test("existing", () => {
      const doc = init("docx", {
        "foo/bar": "test",
      });
      doc.mkdir("foo");
      expect(Object.keys(doc.zip.files)).toEqual(["foo/", "foo/bar"]);
    });

    test("nested", () => {
      const doc = init("docx", {
        "foo/bar/baz": "test",
      });
      doc.mkdir("foo");
      expect(Object.keys(doc.zip.files)).toEqual([
        "foo/",
        "foo/bar/",
        "foo/bar/baz",
      ]);
    });
  });

  describe("writeFile", () => {
    test("new", () => {
      const doc = init("docx", {});
      doc.writeFile("foo", "test");
      expect(Object.keys(doc.zip.files)).toEqual(["foo"]);
    });

    test("existing", async () => {
      const doc = init("docx", {
        foo: "test",
      });
      doc.writeFile("foo", "testing");
      expect(Object.keys(doc.zip.files)).toEqual(["foo"]);
      expect(await doc.zip.file("foo")?.async("string")).toEqual("testing");
    });

    test("nested", async () => {
      const doc = init("docx", {});
      doc.writeFile("foo/bar/baz", "testing");
      expect(Object.keys(doc.zip.files)).toEqual([
        "foo/",
        "foo/bar/",
        "foo/bar/baz",
      ]);
      expect(await doc.zip.file("foo/bar/baz")?.async("string")).toEqual(
        "testing",
      );
    });
  });

  describe("writeFiles", () => {
    test.todo("");
  });

  describe("readFile", () => {
    test("exiting", async () => {
      const doc = init("docx", {
        "foo/bar/baz": "testing",
      });
      expect(await doc.readFile("foo/bar/baz", "string")).toEqual("testing");
    });

    test("missing", async () => {
      const doc = init("docx", {});
      await expect(doc.readFile("foo/bar/baz", "string")).rejects.toEqual(
        new Error("Missing file: foo/bar/baz"),
      );
    });
  });
});
