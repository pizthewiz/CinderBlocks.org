
### INTERN
- set updated to GET /repos/:owner/:repo/branches/:branch
- do something with forks

### WEB
- style the page
- fallback block image and colors
- favicon
- analytics? [MixPanel's Partner Plan](https://mixpanel.com/free/) or [Amplitude](https://amplitude.com)?
- add an error page
- add a simple about page with colophon and basic cinderblock info

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
