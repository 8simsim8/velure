<?php
$phone = $_POST['phone'];
$email = $_POST['email'];

$mes = '<p>Phone: '.$phone.'</p>
        <p>E-mail: '.$email.'</p>';

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
$mail->Subject = 'New Message from site kredit.24.loc';

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
$mail->AltBody = "Phone: $phone \n E-mail: $email";

if (!$mail->send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
    return false;
} else {
    echo "Message sent!";
    return false;
}