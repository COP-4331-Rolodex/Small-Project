<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

    error_reporting(E_ALL); // reports all errors
    ini_set("display_errors", "1"); // shows all errors
    ini_set("log_errors", 1);
    ini_set("error_log", "/tmp/php-error.log");

        $inData = getRequestInfo();

        $searchResults = "";
        $searchCount = 0;

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
        //$id = 129;
        //$name = "a";

        //$parts = explode(" ", $name);
        $parts = explode(" ", $inData["name"]);
        if(count($parts) > 1) {
            //list($first, $last) = explode(" ", $name);
            list($first, $last) = explode(" ", $inData["name"]);

            $stmt = $conn->prepare("SELECT * from contacts where first_name like ? and last_name like ? and owner_id=?");

            $first_name = "%" . $first . "%";
            $last_name = "%" . $last . "%";

            $stmt->bind_param("ssi", $first_name, $last_name, $inData["id"]);
            //$stmt->bind_param("ssi", $first_name, $last_name, $id);

            $stmt->execute();
        }

        else{
            $stmt = $conn->prepare("SELECT * from contacts where (first_name like ? or last_name like ?) and owner_id=?");

            $first_name = "%" . $inData["name"] . "%";
            $last_name = "%" . $inData["name"] . "%";
            //$first_name = "%" . $name . "%";
            //$last_name = "%" . $name . "%";
            $stmt->bind_param("ssi", $first_name, $last_name, $inData["id"]);
            //$stmt->bind_param("ssi", $first_name, $last_name, $id);

            $stmt->execute();
        }

                $result = $stmt->get_result();

		$searchResults = array();

                while($row = $result->fetch_assoc())
                {
			$searchResults[$searchCount] = $row["first_name"]. ' ' . $row["last_name"]. ' ' . $row["email"] . ' '. $row["phone"] . ' ' . $row["id"];
			$searchCount++;
                }

                //$length = count($searchResults);

                if( $searchCount == 0 )
                {
                        returnWithError( "No Records Found" );
                }
                else
                {
                        sendResultInfoAsJson( $searchResults );
                }

                $stmt->close();
                $conn->close();
        }

        function getRequestInfo()
        {
                return json_decode(file_get_contents('php://input'), true);
        }

        function sendResultInfoAsJson( $obj )
        {
                header('Content-type: application/json');
		//$length = count($obj);
                //for ($i = 0; $i < $length; $i++) {
                //echo $obj[$i];
                //echo "\r\n";
                //}
                sendResultInfoAsJson( $obj );
        }

        function returnWithError( $err )
        {
                $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

?>
