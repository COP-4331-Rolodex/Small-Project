<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");


$inData = getRequestInfo();

  $servername = "localhost";
  $username = "dev";
  $password = "knights";
  $database = "Contacts";

  // Create connection
  $conn = new mysqli($servername, $username, $password, $database);
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
      //$conn->query("SET @in_id='4';");
      $conn->query("SET @in_id='$inData[id]';");

      //$conn->query("SET @in_first_name='New';");
      $conn->query("SET @in_first_name='$inData[first_name]';");

      //$conn->query("SET @in_last_name='Info';");
      $conn->query("SET @in_last_name='$inData[last_name]';");

      //$conn->query("SET @in_email='Yes@example.com';");
      $conn->query("SET @in_email='$inData[email]';");

      //$conn->query("SET @in_phone=1111111111;");
      $conn->query("SET @in_phone=$inData[phone];");

      $update = $conn->query("CALL `Update_contact`(@in_id, @in_first_name, @in_last_name, @in_email, @in_phone);");
      if($update != NULL)
      {
        echo "Record updated successfully.";
      }
      $conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
