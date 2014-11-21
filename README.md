
# CinderBlocks.org
[CinderBlocks.org](http://cinderblocks.org) is micro catalogue of *CinderBlocks*, extensions for the C++ creative-coding library [Cinder](http://libcinder.org). The block directory is kept fresh via a periodic task that queries [GitHub](https://github.com).

There are many things the project does not do, including but certainly not limited to:
- Forks
- Categories or tags

**NOTE**: The microsite is *entirely un-styled* at present.

### BLOCK DISCOVERY
The block discovery mechanism is imperfect as the [GitHub API](https://developer.github.com/v3/) does not yet allow searching un-scoped code and in turn, a stratagem is used that could fail to find some blocks. Blocks are identified by the presence of the file `cinderblock.xml`, which is what would be required by Cinder's project generation tool [TinderBox](http://libcinder.org/docs/welcome/TinderBox.html).

The process occurs in two phases: (1-2) find all users with blocks (3-5) find all blocks for users.
1. [GitHub.com Search results](https://github.com/search?p=1&q=cinderblock.xml+in%3Apath&type=Code) are scraped and the list of users compiled and stored on disk at *data/users.json*
2. If the file *data/users-missing.json* exists, its contents are appended to the in-memory user list
3. Each user is then searched for repositories with the file `cinderblock.xml`
4. Repositories with more than one `cinderblock.xml` file are ignored
5. Metadata is captured from several GitHub API edges and fused for our use

Hopefully the [GitHub API](https://developer.github.com/v3/) exposes programatic un-scoped code searching at some point and this can be further improved and streamlined.

### DEVELOPMENT
The repository contains two primary pieces, `app.js` and `intern.js`. `app.js` is a simple [Express](http://expressjs.com) application that simply serves static site content, there aren't any dynamic elements. `intern.js` is a [Node.js](http://nodejs.org) module that uses the [GitHub API](https://developer.github.com/v3/) (and web scraping) to discover users and blocks, and fetch the associated metadata - `intern.js` is not used directly but via `gulp`. Both components are run on [Heroku](https://heroku.com).

The [GitHub API](https://developer.github.com/v3/) request limit is much higher when authenticated. Create a developer application in your [GitHub User Applications](https://github.com/settings/applications/) settings and use them in the environment:
```sh
$ export GITHUB_ID=ID
$ export GITHUB_SECRET=SECRET
```

`gulp` tasks are used for the discovery process:
```sh
$ gulp find:users && gulp find:blocks
```

Typically the `find:blocks` task can be decoupled from and run more often than `find:users` as blocks are updated far more often than they are created.

The static site served by `app.js` can be run locally via:
```sh
$ npm start
```

The envinroment variables can be placed into a file *.env* and the tasks launched via [`foreman`](http://ddollar.github.io/foreman/) which will execute with the ENV set.
```sh
$ foreman run gulp find:blocks
```

---

Some features used on the user-facing microsite are rather new and in turn, not well supported yet across all browsers.
- [canvas blend modes](http://caniuse.com/#search=canvas blend modes)

### PRE-EXISTING CATALOGUES
There are a couple of existing projects that catalogue CinderBlocks, though neither has been updated in quite some time:
- [Cindering](http://cindering.org/blocks/)
- Kod3000's [Cinder Blocks](http://dany.pro/jects/ongoing/cinder_display_all_blocks.html)

### REFERENCES
- [Cinder Docs: CinderBlock](http://libcinder.org/docs/welcome/CinderBlocks.html)
- [RFC: CinderBlocks](https://forum.libcinder.org/topic/rfc-cinderblocks)
- [Cinder Docs: TinderBox](http://libcinder.org/docs/welcome/TinderBox.html)

### GREETZ
- the [ofxAddons.com](http://ofxaddons.com) crew
