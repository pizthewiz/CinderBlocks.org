
### INTERN
- check for cinderblock.png, record presence
- check for and record sample count
- read cinderblock.xml, record supported, template count, url, library, summary
- do something with forks
- add function to set bucket policy

### WEB
- basic info layout
- add a simple about page with colophon and basic cinderblock info
- add an error page
- some analytics: [MixPanel's Partner Plan](https://mixpanel.com/free/) or [Amplitude](https://amplitude.com)?
- draw block image into canvas to scale/center
- create default block image, cycle through colors
- filter by: OS, samples
- sort by: stars, created, updated
- add a favicon

### GENERAL
- set [S3 bucket policy](https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html) referrer check
- periodically run intern on [Heroku](https://www.heroku.com/) or [nodejitsu](https://www.nodejitsu.com/)

### LATER
- consider [PourOver](http://nytimes.github.io/pourover/) for block sorting and filtering
- consider persistant blocks_metadata.json for key-value metadata store
