$(document).ready(function() {
    $('#results').hide();
    $('#warning').hide();
    $('#submitBtn').attr('disabled','disabled');
    $('#password2').attr('disabled','disabled');
    var p1,p2;
    var last_q='';
    $('#password1').on('keyup', function(){
      p1 = $('#password1').val();
      p2 = $('#password2').val();
      minReq(p1);
      test(p1,p2);
    });
    $('#password2').on('keyup', function(){
      p1 = $('#password1').val();
      p2 = $('#password2').val();
      test(p1,p2);
    });
    $('#submitBtn').on('click',function(){
      var status = jQuery('#msg').html();
      var result = zxcvbn(p2);
      alert("Your password is "+status+
            "\nIt can be cracked in:\n"+
            result.crack_times_display.online_throttling_100_per_hour+" if there's an online attack\n"+
            result.crack_times_display.offline_slow_hashing_1e4_per_second+" if there's an offline attack assuming multiple attackers with proper user-unique salting, and a slow hash function w/ moderate work factor, such as bcrypt, scrypt, PBKDF2.");
    });
});
function minReq(p)
{
  var regex = '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$';
  var htmlSuggestions, errors=[];

  if (p.length < 6 || p.length > 12)
  {
    errors.push("Your password must be at least 6 characters and at most 12 characters long.");
  }
  if (p.search(/[a-z]/i) < 0)
  {
    errors.push("Your password must contain at least one letter.");
  }
  if (p.search(/[0-9]/) < 0)
  {
    errors.push("Your password must contain at least one digit.");
  }
  if (errors.length > 0)
  {
    htmlSuggestion = "<ul>"
    $.each(errors, function(i,j){
      htmlSuggestion+="<li>"+j+"</li>";
    });
    htmlSuggestion+="</ul>";

    $('#msg').html('Minimum Requirements for password are:');
    $('#warning').removeClass().html('');
    $('#suggestions').html(htmlSuggestion);
    $('#results').removeClass().addClass('bs-callout bs-callout-danger').show();
    $('#submitBtn').attr('disabled','disabled');
    $('#password2').attr('disabled','disabled');
  }
  else
  {
    $('#results').removeClass().hide();
    $('#password2').removeAttr('disabled');
  }
}
function test(p1,p2)
{
  console.log(p1+":::"+p2);
  if(p1=='' && p2=='')
    $('#results').hide();
  else if(p2 !== p1 && p2!=''){
    emptyResults();
  }
  else if(p2 == p1){
    //last_q = p2;
    r = zxcvbn(p2);
    console.log(r);
    analyseResult(r);
  }
}
function emptyResults()
{
  $('#submitBtn').attr('disabled','disabled').removeClass().addClass('btn btn-default');
  $('#msg').html('Mismatch');
  $('#suggestions').html('Passwords in both fields should match.');
  $('#warning').html('');
  $('#results').removeClass().addClass('bs-callout bs-callout-danger').show();
}
function analyseResult(r)
{
  var htmlSuggestion, htmlWarning;
  if(r.feedback.suggestions.length > 0)
  {
    htmlSuggestion = "<ul>"
    $.each(r.feedback.suggestions, function(i,j){
      htmlSuggestion+="<li>"+j+"</li>";
    });
    htmlSuggestion+="</ul>";
  }
  else {
    htmlSuggestion="";
  }
  if(r.feedback.warning!=null && r.feedback.warning!='')
  {
    htmlWarning= r.feedback.warning;
    $('#warning').html(htmlWarning);
    $('#warning').show();

  }
  else {
    htmlWarning="";
  }

  switch(r.score){
    case 0:
      $('#msg').html('Very Weak');
      $('#warning').removeClass().addClass('bg-danger');
      $('#suggestions').html(htmlSuggestion);
      $('#results').removeClass().addClass('bs-callout bs-callout-danger').show();
      $('#submitBtn').attr('disabled','disabled');
      break;
    case 1:
      $('#msg').html('Weak');
      $('#warning').removeClass().addClass('bg-danger');
      $('#suggestions').html(htmlSuggestion);
      $('#results').removeClass().addClass('bs-callout bs-callout-danger').show();
      $('#submitBtn').removeAttr('disabled').removeClass().addClass('btn btn-danger');
      break;
    case 2:
      $('#msg').html('Medium');
      $('#warning').removeClass().addClass('bg-warning');
      $('#suggestions').html(htmlSuggestion);
      $('#results').removeClass().addClass('bs-callout bs-callout-warning').show();
      $('#submitBtn').removeAttr('disabled').removeClass().addClass('btn btn-warning');
      break;
    case 3:
      $('#msg').html('Strong');
      $('#suggestions').html(htmlSuggestion);
      $('#results').removeClass().addClass('bs-callout bs-callout-good').show();
      $('#submitBtn').removeAttr('disabled').removeClass().addClass('btn btn-success');
      break;
    case 4:
      $('#msg').html('Very Strong');
      $('#suggestions').html(htmlSuggestion);
      $('#results').removeClass().addClass('bs-callout bs-callout-good').show();
      $('#submitBtn').removeAttr('disabled').removeClass().addClass('btn btn-success');
      break;
  }
}
