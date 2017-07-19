$(document).ready(function(){

	getLocationRightNow();

});

document.addEventListener("deviceready", function(){
   getLocationRightNow();
});

$('[name="camera"]').click(function(){
	getBarcodeScanner();
});

$('[name="submit"]').click(function(){
	submitForm();
})

$('[name="longitude"]').on('change',function(){
	getAddressDetail();
})

$('[name="latitude"]').on('change',function(){
	getAddressDetail();
})

function getLocationRightNow(){
	navigator.geolocation.getCurrentPosition(function(location) {
		$('[name="latitude"]').val(location.coords.latitude);
		$('[name="longitude"]').val(location.coords.longitude);
		getAddressDetail();
	});
}

function getAddressDetail(){
	var latitude = $('[name="latitude"]').val();
	var longitude = $('[name="longitude"]').val();
	var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor="true"';
	
	$.ajax({
		url : url,
		type : 'get',
		dataType : 'json',
		async : false,
		success : function(result){
			$('[name="alamat"]').val(result.results[0].formatted_address);
		}
	});
}

function getBarcodeScanner(){
	cordova.plugins.barcodeScanner.scan(
	    function (result){
	    	$('[name="qrcode"]').val(result.text);
	    },
	    function (error){
    		showErrMsg(error);
    	}
    );
}

function validateBeforeSubmit(){
	var nim = $('[name="nim"]').val();
	var latitude = $('[name="latitude"]').val();
	var longitude = $('[name="longitude"]').val();
	var alamat = $('[name="alamat"]').val();
	var qrcode = $('[name="qrcode"]').val();
	if( nim == '' || latitude == '' || longitude == ''  || alamat == '' || qrcode == '' ){
		return false;
	}
	return true;
}

function submitForm(){
	var validate = validateBeforeSubmit() ;
	if(validate == false){
		showErrMsg('Beberapa field masih kosong');
	}
	else{
		var confirmationAlert = confirm('Apakah data data yang dimasukkan sudah benar ? ');
		if(confirmationAlert == true){
			var data = {
				nim : $('[name="nim"]').val(),
				latitude : $('[name="latitude"]').val(),
				longitude : $('[name="longitude"]').val(),
				address : $('[name="alamat"]').val(),
				qrcode : $('[name="qrcode"]').val()
			}

			$.ajax({
				url : 'http://192.168.43.51:3000/users/simpanAbsensi',
				type : 'POST',
				dataType : 'JSON',
				data : {nim:data.nim,latitude:data.latitude,longitude:data.longitude,address:data.address,qrcode:data.qrcode}
			}).then( result => {
				showErrMsg('Data berhasil disimpan',true);
			}).catch( err => {
				var text = err.responseText.toJSON();
				showErrMsg(text.msg,false);
			})
		}
	}
}

function showErrMsg(msg,status){
	var statusMsg = 'danger';
	var txtStatus = 'Error';
	if(status == true){
		statusMsg = 'success';
		txtStatus = 'Success';
	}
	var htmlErrMsg = '<div class="row">\n\
					<div class="col-md-6 col-md-offset-3 col-xs-12 margin-top-10">\n\
						<div class="alert alert-'+statusMsg+' alert-dismissable">\n\
							<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\n\
							<strong>'+txtStatus+' !</strong>'+msg+'\n\
						</div>\n\
					</div>\n\
					</div>';
	$('#notificationMsg').html(htmlErrMsg);
}

