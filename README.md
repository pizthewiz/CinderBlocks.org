
# CinderBlocks.org
[CinderBlocks.org](http://cinderblocks.org) is micro catalogue of *CinderBlocks*, extensions for the C++ creative-coding library [Cinder](http://libcinder.org). The block directory is kept fresh via a periodic task that queries [GitHub](https://github.com).

There are many things the project does not do, including but certainly not limited to:
- Forks
- Categories or tags

**NOTE**: The microsite is *entirely un-styled* at present.

### BLOCK DISCOVERY
The block discovery mechanism is imperfect as the [GitHub API](https://developer.github.com/v3/) does not yet allow searching un-scoped code and in turn, a stratagem is used that could fail to find some blocks. Blocks are identified by the presence of the file `cinderblock.xml`, which is what would be required by Cinder's project generation tool [TinderBox](http://libcinder.org/docs/welcome/TinderBox.html).

The discovery process occurs in two primary phases: first to find all users with blocks (steps 1-2) and the second, find all blocks for the given users (steps 3-5).

1. [GitHub.com Search results](https://github.com/search?p=1&q=cinderblock.xml+in%3Apath&type=Code) are scraped and the list of users compiled
2. The in-memory user list appends the contents of `data/users-missing.json` if present
3. Each user is then searched for repositories with the file `cinderblock.xml`
4. Repositories with more than one `cinderblock.xml` file are ignored
5. Metadata is captured and fused from several GitHub API edges as well as `cinderblock.xml`

Hopefully the [GitHub API](https://developer.github.com/v3/) exposes programatic un-scoped code searching at some point and this can be further improved and streamlined.

### DEVELOPMENT
The repository contains two pieces, `app` and `intern.js`. The microsite is contained within the `app` folder and uses  [Bower](http://bower.io) to install and manage library dependencies. `intern.js` is a [Node.js](http://nodejs.org) module that uses the [GitHub API](https://developer.github.com/v3/) (and web scraping) for block discovery.

#### SETUP
[Node.js](http://nodejs.org), it's package manager [npm](https://www.npmjs.com/) and [Bower](http://bower.io) are required for development. Once the repo has been cloned, install the project dependencies:
```sh
$ npm install && bower install
```

#### MICROSITE
The microsite is a pretty basic [Angular.js](https://angularjs.org/) (💩) app with the source contained within the `app` folder. Local development is made a bit easier through a series of `gulp` commands. A built-in webserver can be launched running the app source via:

```sh
$ gulp connect
```

Before publishing the microsite, the app HTML, JavaScript and CSS are minified and in some cases concatenated into the *dist* folder, reducing file sizes and the number of remote fetches. Similar to running the app source directly, a `gulp` task can be used to launch the built version:

```sh
$ gulp build && gulp connect-dist
```

The microsite is hosted via AWS S3 and a few environment variables are used to hold AWS credentials:

```sh
$ export AWS_ACCESS_KEY_ID=ID
$ export AWS_SECRET_ACCESS_KEY=SECRET
```

Yet another `gulp` task is used to publish the built version of the microsite, the *dist* output, to AWS:

```sh
$ gulp publish
```

The envinroment variables can be placed into the `git`-ignored file *.env* and tasks launched via [`foreman`](http://ddollar.github.io/foreman/) which will execute the command with the ENV variables set.

```sh
$ foreman run gulp publish
```

#### EXPLORER
In production use, the `intern.js` CinderBlock explorer module is hosted on [Heroku](https://heroku.com) and runs periodically to update the block list.

The [GitHub API](https://developer.github.com/v3/) request limit is much higher when authenticated, so please create a developer application in your [GitHub User Applications](https://github.com/settings/applications/) settings and use them in the environment:

```sh
$ export GITHUB_ID=ID
$ export GITHUB_SECRET=SECRET
```

Two `gulp` tasks are used for the discovery process:

```sh
$ gulp find-users && gulp find-blocks
```

The resulting data can then be published to AWS for use by the microsite via:

```sh
$ gulp publish-blocks
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
