# Contribute

If you have a cool idea, feature or bug you want to add then fork, clone and create a pull request.

## Philosophy

* **Pragmatic:** Discuss this solution on GitHub so that we can get a clear objective of what you are trying to achieve.

* **Simplistic:** Take the simplest approach to meet your objective. Stay functional and extract complicated logic into simple functions.

* **Easy:** Make it easy read (for **humans** and machines) and make it easy to modify and extend.

* **Consistent:** Stick to existing conventions and run your code through `npm run lint` and fix accordingly.

* **Confidence:** Test.

## Release

Steps to releasing a new package: *(notes for future me)*

* `npm run release` to bump the version in package.json, create a release commit and tag it with that version number.

* `git push -u origin --tags` to push the latest changes with the newly created tag.

* `npm publish` latest version of the package to the world.
