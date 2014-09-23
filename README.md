
# CinderBlocks.org
[CinderBlocks.org](http://cinderblocks.org) is micro catalogue of *CinderBlocks*, extensions for the C++ creative-coding library [Cinder](http://libcinder.org). The block directory is kept fresh via a periodic task that queries [GitHub](https://github.com).

There are many things the project does not do, including but certainly not limited to:
- Forks
- Categories or tags

**NOTE**: The microsite is *entirely un-styled* at present.

### BLOCK DISCOVERY
The block discovery mechanism is imperfect as the [GitHub API](https://developer.github.com/v3/) does not yet allow searching un-scoped code, and turn some a stratagem is used that could fail to find some blocks. Blocks are identified by the presence of a `cinderblock.xml`, which is what would be required by Cinder's project creation tool [TinderBox](http://libcinder.org/docs/welcome/TinderBox.html).

The process occurs in two phases: (1) find all users with blocks (2-5) find all blocks for users.
1. [GitHub.com Search results](https://github.com/search?p=1&q=cinderblock.xml+in%3Apath&type=Code) are scraped and the list of users compiled and stored on disk at *_users.json*
2. If the file *users-missing.json* exists, its contents are appended to the in-memory user list
3. Each user is then searched for repositories with the file `cinderblock.xml`
4. Repositories with more than one `cinderblock.xml` file are ignored
5. Metadata is captured from several sources and fused to form

The extra steps (2-3) result in a few more blocks than if only the repositories found via scraping were used from (1). Hopefully the [GitHub API](https://developer.github.com/v3/) exposes programatic un-scoped code searching at some point and this can be further improved and streamlined.

### DEVELOPMENT
The repository contains two primary pieces, `web` and `intern`. The `web` folder contains a static user-facing microsite that is served directly via [AWS S3](http://aws.amazon.com/s3/). Conversely, `intern.js` is a [Node.js](http://nodejs.org) module that uses the [GitHub API](https://developer.github.com/v3/) (and web scraping) to discover blocks and fetch the associated metadata.

Two environment variables are required when publishing the `web` microsite:

```sh
$ export AWS_ID=ID
$ export AWS_SECRET=SECRET
```

A [`gulp`](http://gulpjs.com) task triggers deployment:
```sh
$ gulp publish:web
```

The [GitHub API](https://developer.github.com/v3/)  request limit is much higher when authenticated. Create a developer application in your [GitHub User Applications](https://github.com/settings/applications/) settings and use them in the environment:
```sh
$ export GITHUB_ID=ID
$ export GITHUB_SECRET=SECRET
```

Naturally, `gulp` tasks are used for the whole process:
```sh
$ gulp find:users && gulp find:blocks
```

Typically the `find:blocks` task can be decoupled from and run more often than `find:users` as blocks are updated far more often than created.

---

Some features used on the user-facing microsite are rather new and in turn, not well supported yet across all browsers.
- [canvas blend modes](http://caniuse.com/#search=canvas blend modes)
- HTTP responses from AWS provide gzipped resources

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
