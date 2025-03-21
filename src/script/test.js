let matches = content.match(
  /(#book\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?)|(#webpage\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?)|(#thesis\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?)/gsu
);

let prefContent = matches ? matches.join("\n\n") : "";

if (prefContent.length > 0) {
  prefContent = prefContent.replace(
    /#book\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gsu,
    (match, author, title, year, publisher) => {
      return `@book{${crypto.randomUUID()},,
    author    = {${author}},
    title     = {${title}},
    year      = {${year}},
    publisher = {${publisher}}
  }
  `;
    }
  );

  prefContent = prefContent.replace(
    /#webpage\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gsu,
    (match, author, title, year, note, link) => {
      return `@misc{${crypto.randomUUID()},,
    author    = {${author}},
    title     = {${title}},
    year      = {${year}},
    url       = {${link}},
    note      = {Truy cập ngày ${note}}
  }
  `;
    }
  );

  prefContent = prefContent.replace(
    /#thesis\s*\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n\$(.*?)\n#?/gsu,
    (match, author, title, year, type, school) => {
      type = type.trim().toLowerCase();
      if (type == "mastersthesis") {
        return `@mastersthesis{${crypto.randomUUID()},,
    author    = {${author}},
    title     = {${title}},
    school    = {${school}},
    year      = {${year}}
  }
  `;
      } else {
        return `@phdthesis{${crypto.randomUUID()},
    author    = {${author}},
    title     = {${title}},
    school    = {${school}},
    year      = {${year}}
  }
  `;
      }
    }
  );
}
return prefContent;
