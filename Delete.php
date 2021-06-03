<?php
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
		$conn->query("SET @in_id='$inData[id]'; CALL 'Delete_contact'(@in_id);");
		if ($conn->query("CALL 'Read_Contact'(@in_id)") == NULL)
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
