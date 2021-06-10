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
		//$inData[in_id]
		//$conn->query("SET @in_id='13'; CALL `Delete_contact` (@in_id);");
		//$conn->query("SET @in_id=13; CALL `Delete_contact`(@in_id);");
		
	        $conn->query("SET @in_id='$inData[id]';");
                $conn->query("CALL `Delete_contact`(@in_id);");
	       	$delete = $conn->query("CALL `Read_contact`(@in_id);");
	
		if ($delete == NULL)
                {
                        echo "Record deleted successfully.";
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
