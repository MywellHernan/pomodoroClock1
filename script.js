$(document).ready(function() {
  $('#pause').prop('disabled',true);
  $('#restore').prop('disabled',true);
  var sCount = +$("#sNum").val(); //get Session number
  var bCount = +$("#bNum").val(); //get Break Number
  var minutes;
  var seconds;
  var brk = false;
  var paused = false;
  var count;
  var soundsrc1 = "http://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3";
  var soundsrc2 = "http://soundbible.com/mp3/sms-alert-5-daniel_simon.mp3";
  var chime1 = new buzz.sound(soundsrc1);
  var chime2 = new buzz.sound(soundsrc2);
  var timer = new ProgressBar.Circle('#progress', {
    easing: 'linear',
    strokeWidth: 6,
    trailWidth: 6,
    trailColor: '#156767',
    color: '#0CE8AA',
    from: {color: "#0CE8AA"},
    to: {color: '#156767'},
    step: function(state, timer) {
      timer.path.setAttribute('stroke', state.color);
    },
    text: {
      value: sCount + ':00',
      className: 'timerlabel'
    }
  });
  // Countdown configuration
  function countdown(n) {
    clearInterval(count);
    count = setInterval(function() {
      n--;
      minutes = Math.floor(n / 60);
      seconds = n % 60;
      if (n % 60 >= 10) {
        timer.setText(minutes + ":" + seconds);
      } else {
        timer.setText(minutes + ":" + "0" + seconds);
      }
      //timer.setText(minutes + ':' + seconds);
    }, 1000);
  }
  //End of countdown
  //Endless Loops if none of the buttons are pressed
  function loop() {
    timer.set(0);
    $("#t2").text("Session");
    brk = false;
    countdown(sCount * 60);
    chime1.play(); 
    timer.animate(1, {
      from: {color: "#0CE8AA"},
      to: {color: '#156767'},
      duration: sCount * 60000
    }, function() {
      chime2.play(); 
      timer.set(0);
      $("#t2").text("Break");
      brk = true;
      countdown(bCount * 60);
      timer.animate(1, {
        from: {color: "#156767"},
        to: {color: "#0CE8AA"},
        duration: bCount * 60000
      }, loop);
    });
  }
  // End of loops
  // Controls configuration
  $('#restore').click(function() {
    $('.sttr').prop('disabled',false); 
    timer.stop();
    timer.set(0);
    $("#t1, #t3").css({color: "#FFF"});
    $("#t2").css({color: "#008080"});
    clearInterval(count);
    timer.setText(sCount + ':00');
    $('#start').prop('disabled',false); 
    $('#pause').prop('disabled',true); 
  });
  $('#pause').click(function() {
    timer.stop();
    clearInterval(count);
    paused = true;
    $('#start').prop('disabled',false); 
  });
  $('#start').click(function() {
    $('.sttr').prop('disabled',true); 
    $('#start').prop('disabled',true); 
    $('#pause').prop('disabled',false);
    $('#restore').prop('disabled',false);
    $("#t1, #t3").css({color: "#008080"});
    $("#t2").css({color: "#FFF"});
    if (paused) {
      var r = minutes * 60 + seconds; 
      if (brk) { //When break is true
        paused = false;
        countdown(r);
        chime2.play(); 
        timer.animate(1, {
          from: {color: "#156767"},
          to: {color: "#0CE8AA"},
          duration: r * 1000
        }, loop);
      } else { //when break is false
        paused = false;
        countdown(r);
        chime1.play();
        timer.animate(1, {
          duration: r * 1000
        }, function() {
          chime2.play();
          brk = true;
          $('#t2').text('Break');
          timer.set(0);
          countdown(bCount * 60);
          timer.animate(1, {
            from: {color: "#156767"},
            to: {color: "#0CE8AA"},
            duration: bCount * 60000
          }, loop);
        });
      }
    } else {
      loop();
    }
  });
  // End of controls configuration
  // Time setters
  $("#minusS").click(function() {
    if (sCount > 1) {
      sCount --;
    }
    //Set new Session value
    timer.setText(sCount + ':00');
    $("#sNum").val(sCount);
  });
  $("#plusS").click(function() {
    sCount ++;
    //Set new Session value
    timer.setText(sCount + ':00');
    $("#sNum").val(sCount);
  });
  $("#minusB").click(function() {
    if (bCount > 1) {
      bCount --;
    }
    //Set new Break value
    $("#bNum").val(bCount);
  });
  $("#plusB").click(function() {
    bCount ++;
    //Set new Break value
    $("#bNum").val(bCount);
  });
  // End of time setters
});
