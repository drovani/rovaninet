// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: "Rovani in C#",
  plugins: [
    {
      use: "gridsome-plugin-tailwindcss",
    },
    {
      use: "@gridsome/source-filesystem",
      options: {
        path: "posts/**/*.md",
        typeName: "Post",
      },
    },
    {
      use: "gridsome-plugin-netlify-cms",
      options: {
        publicPath: "/admin",
      },
    },
    {
      use: "gridsome-plugin-typescript"
    }
  ],
  transformers: {
    remark: {
      externalLinksTarget: "_blank",
      externalLinksRel: ["nofollow", "noopener", "noreferrer"],
      anchorClassName: "icon icon-link",
    },
  },
};
