<?php

error_reporting(E_ALL); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

	$inData = getRegistrationInfo();

    if(nullchecker($inData) == 0){
	
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
                $hashedPwd = md5($inData['password']);
                $conn->query("SET @in_password='$hashedPwd';");

                $conn->query("CALL `Create_user`(@in_name, @in_username, @in_password);");

        }
    }

    else{
        returnWithError("User Entered Null Value");
    }

    //Returns 1 if something is null
    function nullchecker($inData){
        if($inData['name'] != "" && $inData['username'] != "" && $inData['password'] != ""){
            return 0;
        }
        else{
            return 1;
        }
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
