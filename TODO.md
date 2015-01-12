
### INTERN
- do something with forks

### WEB
- consider concat JS and CSS, gulp-sourcemaps and gulp-usemin
- use anchor to indicate sort and base filter
- offer on-page search, again dump into anchor
- style the page
- fallback block image and colors
- apple-touch-icon and favicon
- analytics? [MixPanel's Partner Plan](https://mixpanel.com/free/) or [Amplitude](https://amplitude.com)?
- add 404 and 500 error pages
- add a simple about content with colophon and basic cinderblock info with links
- check out the [angularjs-styleguide](https://github.com/johnpapa/angularjs-styleguide)
- use referrer to limit access to /data/blocks.json
- make sure /data/blocks.json is GZIP compressed

### GENERAL
- move blocks.json back to AWS as Heroku doesn't allow file writing

### LATER
- consider persistant blocks_metadata.json for key-value metadata store
    [
      {
        id: 31337,
        tags: [
          'animation',
          'interpolation'
        ]
      },
      {...}
    ]
