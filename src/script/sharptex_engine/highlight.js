import { Editor } from "https://esm.sh/@tiptap/core";
//import StarterKit from "https://esm.sh/@tiptap/starter-kit";
import Document from "https://esm.sh/@tiptap/extension-document";
import Paragraph from "https://esm.sh/@tiptap/extension-paragraph";
import Text from "https://esm.sh/@tiptap/extension-text";
import { Extension } from "https://esm.sh/@tiptap/core";
import { Plugin } from "https://esm.sh/prosemirror-state";
import { Decoration, DecorationSet } from "https://esm.sh/prosemirror-view";

// Create extension
const sharptexHighlighter = Extension.create({
  name: "sharptexHighlighter",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        state: {
          // Constructor (In rule)
          init(_, { doc }) {
            return DecorationSet.create(doc, []);
          },

          // The event when the user typing
          apply(tr, decorationSet, oldState, newState) {
            const decorations = [];

            function highlight(regex, formatType) {
              newState.doc.descendants((node, pos) => {
                if (!node.isTextblock) return true;

                node.descendants((child, childPos) => {
                  if (!child.isText) return;

                  const text = child.text;
                  if (!text) return;

                  let match;

                  while ((match = regex.exec(text)) !== null) {
                    const start = pos + childPos + match.index + 1;
                    const end = start + match[0].length;

                    decorations.push(
                      Decoration.inline(start, end, {
                        class: formatType,
                      })
                    );
                  }
                });

                return false;
              });
            }

            highlight(
              cloneRegex(patterns.biu),
              "sharptex-bold sharptex-italic sharptex-underline"
            );
            highlight(cloneRegex(patterns.bi), "sharptex-bold sharptex-italic");
            highlight(
              cloneRegex(patterns.iu),
              "sharptex-italic sharptex-underline"
            );
            highlight(cloneRegex(patterns.b), "sharptex-bold");
            highlight(cloneRegex(patterns.i), "sharptex-italic");
            highlight(cloneRegex(patterns.u), "sharptex-underline");
            highlight(cloneRegex(patterns.uh), "sharptex-h1");
            highlight(cloneRegex(patterns.h1), "sharptex-h1");
            highlight(cloneRegex(patterns.h2), "sharptex-h2");
            highlight(cloneRegex(patterns.h3), "sharptex-h3");
            highlight(cloneRegex(patterns.c), "sharptex-center");
            highlight(cloneRegex(patterns.r), "sharptex-right");
            highlight(cloneRegex(patterns.key), "sharptex-key sharptex-bold");

            return DecorationSet.create(newState.doc, decorations);
          },
        },

        // Render format (In rule)
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

window.page = new Editor({
  element: document.querySelector(".page"),
  extensions: [Document, Paragraph, Text, sharptexHighlighter],
  //content: "<p>Hello World!</p>",
});

window.toPage = function (text) {
  page.commands.setContent(
    text
      .split(/\r?\n/)
      .map((line) => (line.trim() === "" ? "<p><br></p>" : `<p>${line}</p>`))
      .join("")
  );
};

window.getText = function (doc) {
  let text = "";

  doc.descendants((node, pos, parent) => {
    if (node.isText) {
      text += node.text;
    } else {
      text += "\n";
    }
  });

  return text;
};

document.querySelector(".ProseMirror").setAttribute("spellcheck", "false");
