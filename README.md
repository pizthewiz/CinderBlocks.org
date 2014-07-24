
# CinderBlocks.org
[CinderBlocks.org](http://cinderblocks.org) is microsite catalogue of *CinderBlocks*, extensions for the C++ creative-coding library [Cinder](http://libcinder.org). The block directory is kept fresh via a periodic task that queries [GitHub](https://github.com).

There are many things the project does not do, including but certainly not limited to:
- Forks
- Categories or tags
- User submissions
- Comments
- Twitter announcements

**NOTE**: The block discovery mechanism is imperfect as the GitHub API does not yet allow searching code, and turn some a stratagem is used that misses some blocks. Blocks are discovered from the following [search results](https://github.com/search?p=1&q=cinder+path%3A%2Fcinderblock.xml&type=Code), it may be worth giving that a look before reporting an issue. Also, the microsite is *entirely un-styled* at present.

### DEVELOPMENT
The repository contains two primary pieces, `web` and `intern`. The `web` folder contains a static user-facing microsite that is served directly via [AWS S3](http://aws.amazon.com/s3/). Conversely, `intern.js` is a [Node.js](http://nodejs.org) module that uses the [GitHub API](https://developer.github.com/v3/) (and scraping) to discover blocks and fetch the associated metadata.

Two environment variables are required when publishing the `web` microsite:

```sh
$ export AWS_ID=ID
$ export AWS_SECRET=SECRET
```

A [`gulp`](http://gulpjs.com) task triggers deployment:
```sh
$ gulp publish
```

The [GitHub API](https://developer.github.com/v3/)  request limit is much higher when authenticated. Create a developer application in your [GitHub User Applications](https://github.com/settings/applications/) settings and use them in the envinroment:
```sh
$ export GITHUB_ID=ID
$ export GITHUB_SECRET=SECRET
```

Naturally, a `gulp` task launches the whole process:
```sh
$ gulp generate
```

Some features used on the user-facing microsite are rather new and in turn, not well supported yet across all browsers.
- [canvas blend modes](http://caniuse.com/#search=canvas blend modes)

### PRE-EXISTING
There are a couple of existing projects that catalogue CinderBlocks, though neither has been updated in quite some time:
- [Cindering](http://cindering.org/blocks/)
- Kod3000's [Cinder Blocks](http://dany.pro/jects/ongoing/cinder_display_all_blocks.html)

### REFERENCES
- [Cinder Docs: CinderBlock](http://libcinder.org/docs/welcome/CinderBlocks.html)
- [Cinder Docs: TinderBox](http://libcinder.org/docs/welcome/TinderBox.html)
- [RFC: CinderBlocks](https://forum.libcinder.org/topic/rfc-cinderblocks)

### GREETZ
- the [ofxAddons.com](http://ofxaddons.com) crew
