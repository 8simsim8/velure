<?php
if(isset($_POST) && $_SERVER['REQUEST_METHOD'] == 'POST')
{
  $title = $_POST['title'];
  $phone = $_POST['phone'];
  $name = $_POST['name'];
  $service = $_POST['services'];
  $date = $_POST['date'];
  $time = $_POST['time'];
  $delivery = $_POST['delivery'];
  $par = $_POST['par'];

  if(isset($title)) {$mes ='<h1>'.$title.'</h1>';}
  $mes = $mes.'<hr />';
  if(isset($name)) {$mes = $mes.'<h3>Имя: <span style="font-weight:normal;">'.$name.'</span></h3>';}
  if(isset($phone)) {$mes = $mes.'<h3>Телефон: <span style="font-weight:normal;">'.$phone.'</span></h3>';}
  if(isset($service)) {$mes = $mes.'<h3>Услуга: <span style="font-weight:normal;">'.$service.'</span></h3>';}
  if(isset($date)) {$mes = $mes.'<h3>Дата: <span style="font-weight:normal;">'.$date.'</span></h3>';}
  if(isset($time)) {$mes = $mes.'<h3>Время: <span style="font-weight:normal;">'.$time.'</span></h3>';}
  if(isset($delivery)) {$mes = $mes.'<h3>'.$delivery.'</span></h3>';}
  if(isset($par)) {$mes = $mes.'<h3>Стоимость: <span style="font-weight:normal;">'.$par.'</span></h3>';}


  date_default_timezone_set('Etc/UTC');
  require_once 'PHPMailerAutoload.php';

  $mail = new PHPMailer;
  $mail->CharSet = 'utf-8';
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAutoTLS = true;

  //$mail->SMTPOptions = array(
  //    'ssl' => array(
  //        'verify_peer' => false,
  //        'verify_peer_name' => false,
  //        'allow_self_signed' => true
  //    )
  //);

  $mail->Host = 'smtp.gmail.com';
  $mail->Port = 587;                          //Set the SMTP port number - likely to be 25, 465 or 587
  $mail->SMTPAuth = true;
  $mail->Username = 'TesterCrisp@gmail.com';  // a valid email here
  $mail->Password = 'PasswordTesterCrisp';
  // $mail->FromName = $name;
  // $mail->AddReplyTo($email, $name);
  $mail->addAddress('TesterCrisp@gmail.com', 'Test message');
  $mail->Subject = 'New Message from site velur.loc';

  $y = $indexInputs = '0';

  while($y < count($_FILES)) {

      while(!isset($_FILES['upload-'.$indexInputs])) {
          $indexInputs++;
      }
      echo $indexInputs;
      $i = '0';
      foreach($_FILES['upload-'.$indexInputs] as $file) {
          $mail->AddAttachment($_FILES['upload-'.$indexInputs]['tmp_name'][$i],$_FILES['upload-'.$indexInputs]['name'][$i]);
          $i++;
      }
      $y++;
      $indexInputs++;
  }

  $mail->Body = $mes;
  $mail->AltBody = "Телефон: $phone \n Имя: $name";

  if (!$mail->send()) {
      echo "Mailer Error: " . $mail->ErrorInfo;
      return false;
  } else {
      echo "Message sent!";
      return false;
  }
}
?>