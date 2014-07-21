
### INTERN
- do something with forks

### WEB
- style the page
- fallback block image and colors
- apple-touch-icon and favicon
- analytics? [MixPanel's Partner Plan](https://mixpanel.com/free/) or [Amplitude](https://amplitude.com)?
- add an error page
- add a simple about page with colophon and basic cinderblock info
- revisit relativeTime to round to the closer value 4 hours 50 minutes ago should probably be 5, not 4

### GENERAL
- set [S3 bucket policy](https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html) referrer check
- periodically run intern on [Heroku](https://www.heroku.com/) or [nodejitsu](https://www.nodejitsu.com/)

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
