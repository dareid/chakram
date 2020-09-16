const fs = require("fs");
const path = require("path");

const DOCS_DIR = "./docs";

const LINE_TO_REPLACE =
    '<iframe src="https://ghbtns.com/github-btn.html?user=dareid&repo=chakram&type=star&count=true" style="margin-top: 3px;" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>';

function stripIframes() {
    const htmlFiles = fs.readdirSync(DOCS_DIR).filter((file) => file.endsWith(".html"));

    htmlFiles.forEach((file) => {
        const filePath = path.join(DOCS_DIR, file);
        const htmlContent = fs.readFileSync(filePath, "utf8");

        const updatedContent = htmlContent
            .split("\n")
            .map((line) => {
                if (line.includes("<iframe src")) {
                    return line.replace(LINE_TO_REPLACE, "");
                }

                return line;
            })
            .join("\n");

        fs.writeFileSync(filePath, updatedContent);
    });
}

stripIframes();
