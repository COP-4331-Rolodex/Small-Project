<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

error_reporting(E_ALL); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

	$inData = getRegistrationInfo();

	
        $id = 0;
        $name = "";

        $servername = "localhost";
        $username = "dev";
        $password = "knights";
        $database = "Contacts";
        
        // Create connection
        $conn = new mysqli($servername, $username, $password, $database);	
        if( $conn->connect_error )
        {
            returnWithError( $conn->connect_error );
        }
        else
        {

                $conn->query("SET @in_name='$inData[name]';");
                $conn->query("SET @in_username='$inData[username]';");
                $conn->query("SET @in_password='$inData[password]';");

                $conn->query("CALL `Create_user`(@in_name, @in_username, @in_password);");

        }

    function returnWithError( $err )
	{
		$retValue = '{"id":0,"name":"","username":"","password":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function getRegistrationInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
?>
