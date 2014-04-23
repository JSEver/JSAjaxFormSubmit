/*The MIT License (MIT)
Copyright (c) 2014 https://github.com/JSEver/JSAjaxFormSubmit/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(function($,undefined){
 var defaults = {
	formAction:null,	//If not specified then will fetch from form attribute "action"
	responseType:'json',	//expected response type Ex: HTML,xml,script,json Default json
	requestMethod:'POST',
	requestTimeout:20000,	//default 20 seconds
	submitMsg:'Submitting form...',	//Message to be displayed while request is in progress
	beforesend:function(formData){}, //function to be executed before each upload for more info please refer https://api.jquery.com/jQuery.ajax/
	always:function(formData){}, //function to be executed always each upload for more info please refer https://api.jquery.com/jQuery.ajax/
	done:function(formData,xhr){}, //function to be executed on each upload is done for more info please refer https://api.jquery.com/jQuery.ajax/
	fail:function(response){}, //function to be executed on each upload fails for more info please refer https://api.jquery.com/jQuery.ajax/
	progress:function(formData,event){}, //function to be executed on each upload is in progress for more info please refer https://api.jquery.com/jQuery.ajax/
	complete:function(formData,xhr){}, //function to be executed on each upload completes for more info please refer https://api.jquery.com/jQuery.ajax/
	success:function(response){}, //function to be executed on each upload ajax success for more info please refer https://api.jquery.com/jQuery.ajax/
	error:function(response){}, //function to be executed on each upload ajax error for more info please refer https://api.jquery.com/jQuery.ajax/
	hideFormOnSuccess:false, //Hide Form If Ajax Status return 200
	clearFormFields:false	//Clear all Form Files If Ajax Status return 200
};
 
 $.fn.JSAjaxFormSubmit = function(options) {
	 var settings = $.extend( {}, defaults, options );
	 var sendingMsg = '<div class="JSsendingMsg" style="width: 40%;margin-left: 30%;margin-bottom: 10px;text-align: center;padding: 0px 5px;border: 1px solid rgb(128, 200, 230);border-radius: 15px;background: rgb(94, 159, 243);color: #fff;font-size: 12px;">'+settings.submitMsg+'</div>';
	 var JSAjaxFormSubmit = this;
	 
	this.onSubmit = function(JSNode,e){
		$('div.JSsending',JSNode).html(sendingMsg);
		var formData = $(JSNode).JSFormToJson();
		if(settings.formAction == null || settings.formAction == undefined || settings.formAction.trim() == "")
			settings.formAction =  $(JSNode).attr('action');
		var JSxhr = $.ajax({
			url:settings.formAction,
			type:settings.requestMethod,
			data: formData,
			timeout: settings.requestTimeout,
			beforeSend : function (){if(_isValidFunction(settings.beforesend)) settings.beforesend(formData);},
			success:function(response){
				if(settings.hideFormOnSuccess) $(JSNode).slideUp(500); 
				if(settings.clearFormFields) $(JSNode).JSClearForm(); 
				if(_isValidFunction(settings.onSuccess)) settings.onSuccess(response);
			},
			error:function(xhr,textStatus,errorThrown){if(_isValidFunction(settings.onError)) settings.onError(xhr, textStatus, errorThrown);}
		 });
		if(_isValidFunction(settings.always)) JSxhr.always(function(){settings.always(formData);});
		if(_isValidFunction(settings.complete)) JSxhr.complete(function(){
			$('div.JSsending div.JSsendingMsg',JSNode).hide(500);
			settings.complete(formData,JSxhr);
		});
		if(_isValidFunction(settings.done)) JSxhr.done(function(){settings.done(formData,JSxhr);});
		if(_isValidFunction(settings.fail)) JSxhr.fail(function(){settings.fail(formData,JSxhr);});
	};
	
	return this.each(function(){
		if(!$(this).is( "form" )) return;
		$(this).prepend('<div class="JSsending"></div>');
		$(this).submit(function(event){
			event.preventDefault();
			JSAjaxFormSubmit.onSubmit(this,event);
		});
	});
 };
 $.fn.JSFormToJson = function(){
     var json = {};
     var form = this.serializeArray();
     $.each(form, function() {
         if (json[this.name] !== undefined) {
             if (!json[this.name].push) json[this.name] = [json[this.name]];
             json[this.name].push(this.value || '');
         } else json[this.name] = this.value || '';
     });
     return json;
 };
 $.fn.JSClearForm = function(){
   $('input[type="text"], input[type="password"], input[type="file"], textarea',this).val('');
   $('input[type="checkbox"]',this).prop('checked',false);
   $('select option:first-child',this).prop('selected',true);
 };
var _isValidFunction = function(fn){
	return (fn !== undefined && fn !== null && typeof fn === 'function');
};
})(jQuery);	