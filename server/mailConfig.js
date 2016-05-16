Meteor.startup(function () {
  Accounts.emailTemplates.from = "info@sawiri.club";	
  process.env.MAIL_URL = 'smtp://SMTP_Injection:847d0546a1bab0cfabc8e78a837e45c0043041dd@smtp.sparkpostmail.com:587/';
});