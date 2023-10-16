function ShowMessage(e){var t,r=$("#message-modal");r.get(0)||(t=$('<div style="display: none;"><div id="message-modal"></div></div>'),$(document.body).append(t),r=$("#message-modal")),r.html(e),r.modalwrapper("show")}Forms=window.Forms={},Forms.jsonpEnabled=!1,Forms.Util=Forms.Util||{},Forms.Util.IsFunction=function(e){return e&&"function"==typeof e},Forms.Util.extend=function(e,t){if(e=e||{},t){for(var r in t){var n=t[r];void 0!==n&&(e[r]=n)}!(Forms.Util.IsFunction(window.Event)&&t instanceof window.Event)&&t.hasOwnProperty&&t.hasOwnProperty("toString")&&(e.toString=t.toString)}return e},Forms.Util.logError=function(){console&&Forms.Util.IsFunction(console.error)&&console.error.apply(console,arguments)},Forms.applyScriptOnForm=function(e,t){try{var r=$("#"+t).get(0);if(!r||!Forms.Util.IsFunction(e))return;e.apply(r)}catch(e){Forms.Util.logError(e)}},Forms.applyScriptOnElement=function(e,t){try{var r=$("#"+t).get(0);if(!r||!Forms.Util.IsFunction(e))return;e.apply(r)}catch(e){Forms.Util.logError(e)}},Forms.bindFormToScript=function(e,t,r,n){try{var o=$("#"+r).get(0);if(!o||!Forms.Util.IsFunction(t)||!e)return;(function(){$(this).bind(e,t)}).apply(o),n&&t.apply(o)}catch(e){Forms.Util.logError(e)}},Forms.bindFormToScript=function(e,t,r,n){try{var o=$("#"+r).get(0);if(!o||!Forms.Util.IsFunction(t)||!e)return;(function(){$(this).bind(e,t)}).apply(o),n&&t.apply(o)}catch(e){Forms.Util.logError(e)}},Forms.Class=function(e,t,r){for(var n,o=e.length,i=[],s=0;s<o;s++)i.push(e[s]._ATTRS);(n=function(){$.extend(!0,this,n._ATTRS),r&&Forms.Util.IsFunction(r.initialize)&&r.initialize.apply(this,arguments)})._ATTRS={};t=[!0,n._ATTRS].concat(i,t);return $.prototype.extend.apply($,t),n._PARENTS=e,0<o?(e.push(r),t=[n,e],Forms.inherit.apply(null,t)):n.prototype=r,n},Forms.inherit=function(e,t){function r(){}var n,o=1,i=t.length;for(r.prototype=t[0].prototype,e.prototype=new r;o<i;o++)n=t[o],Forms.Util.IsFunction(n)&&(n=n.prototype),Forms.Util.extend(e.prototype,n)},Forms.FormWrapper=Forms.Class([],{formType:"FormWrapper",presubmitHandlers:[],elements:[],elementsMap:{},enabled:!0,options:{groupSubformElements:!0},fnRenderError:function(e,t){e=Forms.ErrorsToString(e,!0);e&&t.append('<div class="generic-error"><i class="fa fa-fw fa-exclamation-triangle"></i> <span class="error-msg"><b>Error: </b>'+e+"</span></div>")}},{initialize:function(e,t){if(this.id=e,$.extend(!0,this,t),t.elements)for(var r in this.elements=[],this.elementsMap={},t.elements){var n=Forms.BuildFormElement(this.id,t.elements[r]);this.addFormElement(n)}t.elements=void 0,$.extend(!0,this.options,t);e=this.getDomElement();$.data(e,"wrapper",this),$.data(e,"formApi",this),$(e).delegate(".form-cancel","click",{formApi:this},function(e){e=e.data.formApi;e.resetForm(),$(e.getDomElement()).trigger("saveFormDataCancel",[e])}).delegate(".form-back","click",{},function(){history.back()}).bind("submit",{formApi:this},function(e){for(var t=e.data.formApi,r=t.presubmitHandlers.length,n=0,o=!0,n=0;n<r&&!1!==o;n++)o=t.presubmitHandlers[n].apply(t);return o||(e.stopPropagation(),e.stopImmediatePropagation(),e.preventDefault()),o})},fillFormData:function(e,t){var r,n,o,i;for(this.clearErrors(),n=0,o=this.elements.length;n<o;n++)if(r=this.elements[n]){if(m=e[r.name],r.parentName&&(!0===this.options.groupSubformElements||!0===t)){i=[r];for(var s,a=r,m=e;(a=this.elementsMap[a.parentName])&&i.push(a),a&&a.parentName;);for(var l=i.length-1;0<=l;l--)s=i[l].originalName||i[l].name,m=m?m[s]:null}r.setValue(m)}return $(this.getDomElement()).trigger("formDataFilled",[this,e]),this},resetForm:function(){return this.fillFormData({}),this},collectFormData:function(e){for(var t,r,n={},o=0,i=this.elements.length;o<i;o++){var s=(t=this.elements[o]).getValue();if(void 0!==s||null!==s)if(!t.parentName||!0!==this.options.groupSubformElements&&!0!==e)n[t.name]=s;else{r=[t];for(var a=t;(a=this.elementsMap[a.parentName])&&r.push(a),a&&a.parentName;);for(var m=n,l=r.length-1;0<l;l--){var h=r[l].originalName||r[l].name;m[h]=m[h]||{},m=m[h]}m[t.originalName]=s}}return n},getFormElement:function(e){return this.elementsMap[e]},hasFormElement:function(e){return!!this.elementsMap[e]},addFormElement:function(e){if(e.hasValue&&this.elements.push(e),this.elementsMap[e.name]=e,$(this.getDomElement()).trigger("formElementAdded",[this,e]),e.form=this,e.elements)for(var t in e.elements)this.addFormElement(e.elements[t]);return this},deleteFormElement:function(e){var t=this.getFormElement(e);return t&&(t=t.getDomElement(),this.removeFormElement(e),$(t).remove()),this},removeFormElement:function(e){if(!this.elementsMap[e])return this;for(var t=-1,r=[],n=0,o=this.elements.length;n<o;n++){var i=this.elements[n];i.name===e?t=n:i.parentName===e&&r.push(i.name)}for(0<=t&&this.elements.splice(t,1),delete this.elementsMap[e],n=0,o=r.length;n<o;n++)this.removeFormElement(r[n]);return this},getElementValue:function(e){e=this.getFormElement(e);if(e)return e.getValue()},setElementValue:function(e,t){e=this.getFormElement(e);return e&&Forms.Util.IsFunction(e.setValue)&&e.setValue(t),this},clearErrors:function(){var e=$(this.getDomElement());return e.find(".generic-error-container").empty(),e.find(".field-error").remove(),e.find(".error").removeClass("error"),this},appendFormError:function(e){return e&&"string"==typeof e&&e.length&&e.replace(/(^[ ]+)|([ ]+$)/g,"")&&$(this.getDomElement()).find(".generic-error-container").append('<div class="generic-error"><b></b>'+e+"</div>"),this},showErrors:function(e){e=e||{},this.clearErrors();var t,r=$(this.getDomElement()).find(".generic-error-container");if("string"==typeof e)this.fnRenderError(e,r);else for(var n in e)Forms.Util.IsFunction(e[n])||((t=this.getFormElement(n))&&Forms.Util.IsFunction(t.showErrors)?t.showErrors(e[n]):(t=Forms.ErrorsToString(e[n],!1))&&"string"==typeof t&&this.fnRenderError(t,r));return this},getDomElement:function(){return document.getElementById(this.id)},addPresubmitHandler:function(e){return Forms.Util.IsFunction(e)&&this.presubmitHandlers.push(e),this},validate:function(e){var t,r=!0;for(t in this.elementsMap){var n=this.elementsMap[t];"function"==typeof n.validate&&(n.validate(e[t],e)||(r=!1))}return r},showForm:function(){return $(this.getDomElement()).show(),this},hideForm:function(){return $(this.getDomElement()).hide(),this},bind:function(e,t){return $(this.getDomElement()).bind(e,t),this},unbind:function(e){return $(this.getDomElement()).unbind(e),this}}),Forms.AjaxForm=Forms.Class([Forms.FormWrapper],{formType:"AjaxForm",urlSaveData:null,urlGetData:null,isSavingData:!1,enabled:!0,options:{hideOnSuccess:!1}},{initialize:function(){Forms.FormWrapper.prototype.initialize.apply(this,arguments);var e=this.getDomElement();$(e).bind("submit",{formApi:this},function(e){e=e.data.formApi;return!!e._uploadingFiles||(e.clearErrors(),e.saveFormData(),!1)})},getFormData:function(e){if(!this.urlGetData)return!1;"string"!=typeof e&&"number"!=typeof e||(e={id:e,action:"get"});var r=this;return MakeRequest(this.urlGetData,e).done(function(e){r.fillFormData(e||{}),$(r.getDomElement()).trigger("getFormDataSuccess",[r,e])}).fail(function(e,t){r.resetForm(),r.showErrors(e),$(r.getDomElement()).trigger("getFormDataError",[r,e,t])})},saveFormData:function(e){var t=this.collectFormData();return this._saveFormData(t,e)},_saveFormData:function(e,t){if(!this.enabled)return this;if(this.isSavingData&&!0!==t)return this;e=$.extend({action:"save"},e),Forms.RemoveBooleans(e),$(this.getDomElement()).trigger("saveFormDataStart",[this]),this.isSavingData=!0;var r=this;return this.urlSaveData?MakeRequest(this.urlSaveData,e,function(){r._onSaveFormSuccess.apply(r,arguments)},function(){r._onSaveFormError.apply(r,arguments)}):r._onSaveFormSuccess(e),this},_onSaveFormSuccess:function(e){e=e||{},this.isSavingData=!1,this.options.hideOnSuccess&&this.hideForm(),this.options.disableOnSuccess&&(this.enabled=!1),$(this.getDomElement()).trigger("saveFormDataSuccess",[this,e])},_onSaveFormError:function(e,t){this.isSavingData=!1,this.showErrors(e),$(this.getDomElement()).trigger("saveFormDataError",[this,e,t])},showFormAndGetData:function(e){var t=this;return this.showOverlay(),this.getFormData(e).always(function(){t.hideOverlay(),t.showForm()}).fail(function(){t.resetForm()}),this},showFormAndGetDataAsync:function(e){return this.getFormData(e),this.showForm(),this.hideOverlay(),this},showFormAndFillData:function(e){return this.fillFormData(e||{}),this.showForm(),this.hideOverlay(),this},showFormAndReset:function(){return this.showForm(),this.resetForm(),this.hideOverlay(),this},showOverlay:function(){return this},hideOverlay:function(){return this}}),Forms.RemoveBooleans=function(e){if("object"==typeof e)for(var t in e)r(e,t);else if("array"==typeof e)for(t=0;t<e.length;t++)r(e,t);function r(e,t){!0===e[t]?e[t]=1:!1===e[t]?e[t]=0:"object"!=typeof e&&"array"!=typeof e[t]||Forms.RemoveBooleans(e[t])}},Forms.ElementClassByType={},Forms.RegisterFormElement=function(e,t){Forms.ElementClassByType[e]=t},Forms.GetElementClassByType=function(e){return Forms.ElementClassByType[e]||Forms.FormElement},Forms.BuildFormElement=function(e,t){var r=e+"_"+(t.idPart||t.name),e=Forms.GetElementClassByType(t.type);t.parentName&&t.parentName.length&&(t.originalName=t.name,t.name=t.parentName+"_"+t.name);t=new e(r,t);return $("#"+r).data("formApi",t),t},Forms.ErrorsToString=function(e,t){var r="";if("array"==typeof e)for(var n=0;n<e.length;n++)r+=Forms.ErrorsToString(e[n],!0);else if("object"==typeof e)for(var n in e)"string"==typeof e[n]&&(r+=Forms.ErrorsToString(e[n],!0));else e&&"string"==typeof e&&(r=e,t&&(r+="<br/>"));return r},Forms.FormElement=Forms.Class([],{name:"",parentName:"",hasValue:!0,type:"FormElement",validators:[],fnRenderError:function(e,t){var r=$("#"+this.id+"_field"),n=$("#"+this.id+"-label"),o=r.find(".field-errors");o.get(0)||(o=t.find(".field-errors")),t.add(r).addClass("error"),o.get(0)?o.append('<span class="field-error">'+e+"</span>"):n.get(0)?n.append('<span class="field-error">'+e+"</span>"):r.get(0)&&r.prepend('<span class="field-error">'+e+"</span>")}},{initialize:function(e,t){this.id=e,$.extend(!0,this,t)},getValue:function(){return $(this.getDomElement()).val()},setValue:function(e){return $(this.getDomElement()).val(e).trigger("formElementValueChange",[this,e]).triggerHandler("change"),this},clearErrors:function(){var e=$("#"+this.id+"_field");return e.length||(e=$(this.getDomElement())),e.find(".field-error").remove(),e.add(".error").removeClass("error"),this},showErrors:function(e){var t=Forms.ErrorsToString(e,!1),e=$(this.getDomElement());return e.length?this.fnRenderError(t,e):(e=this.getForm())&&e.appendFormError(t),this},getDomElement:function(){return document.getElementById(this.id)},getFormDomElement:function(){var e=this.getForm();if(e&&Forms.Util.IsFunction(e.getDomElement))return e.getDomElement()},getForm:function(){return this.form},validate:function(e,t){if("object"!=typeof this.validators||!(0<this.validators.length))return!0;for(var r=0;r<this.validators.length;r++){var n=this.validators[r];if(n.errors={},!n.validate(e,t))return this.showErrors(n.errors),!1}return!0}}),Forms.FormElementEmpty=Forms.Class([Forms.FormElement],{},{initialize:function(){Forms.FormElement.apply(this,arguments)},getValue:function(){},setValue:function(e){return this}}),Forms.RegisterFormElement("FormElementCustomHtml",Forms.FormElementEmpty),Forms.RegisterFormElement("FormElementButton",Forms.FormElementEmpty),Forms.RegisterFormElement("FormElementSubmit",Forms.FormElementEmpty),Forms.FormElementFile=Forms.Class([Forms.FormElement],{type:"FormElementFile"},{initialize:function(){Forms.FormElement.apply(this,arguments)},getValue:function(){return $.data(this.getDomElement(),"formValue")},setValue:function(e){var t=this.getDomElement();return $.data(t,"formValue",e),$(t).trigger("formElementValueChange",[this,e]),this}}),Forms.RegisterFormElement("FormElementFile",Forms.FormElementFile),Forms.FormElementCheckbox=Forms.Class([Forms.FormElement],{type:"FormElementCheckbox"},{initialize:function(){Forms.FormElement.prototype.initialize.apply(this,arguments)},getValue:function(){return this.getDomElement().checked?1:0},setValue:function(e){return $(this.getDomElement()).prop("checked",1==e).trigger("formElementValueChange",[this,e]),this}}),Forms.RegisterFormElement("FormElementCheckbox",Forms.FormElementCheckbox),Forms.FormElementRadios=Forms.Class([Forms.FormElement],{type:"FormElementRadios"},{initialize:function(){Forms.FormElement.prototype.initialize.apply(this,arguments)},getValue:function(){return $(this.getDomElement()).find("input:radio:checked").val()},setValue:function(e){var t=$(this.getDomElement()).find("input:radio");return null!=e?t.filter('[value="'+e+'"]').prop("checked",!0).trigger("formElementValueChange",[this,e]).triggerHandler("change"):(t.prop("checked",!1),t.eq(0).trigger("formElementValueChange",[this,e]).triggerHandler("change")),this}}),Forms.RegisterFormElement("FormElementRadios",Forms.FormElementRadios),Forms.FormElementSubform=Forms.Class([Forms.FormElement],{hasValue:!1,elements:{},type:"FormElementSubform"},{initialize:function(e,t){for(var r in Forms.FormElement.prototype.initialize.apply(this,arguments),this.elements={},t.elements){t.elements[r].parentName=this.name;var n=t.elements[r].name,o=Forms.BuildFormElement(this.id,t.elements[r]);this.elements[n]=o}},setValue:function(){return this},getValue:function(){},clearErrors:function(){for(var e in this.elements){var t=this.elements[e];Forms.Util.IsFunction(t.clearErrors)&&t.clearErrors()}return this},showErrors:function(e){for(var t in e=e||{}){var r;this.elements[t]?(r=this.elements[t],Forms.Util.IsFunction(r.showErrors)&&r.showErrors(e[t])):Forms.FormElement.prototype.showErrors.call(this,e[t])}return this}}),Forms.RegisterFormElement("FormElementSubform",Forms.FormElementSubform),Forms.FormElementMultipleFields=Forms.Class([Forms.FormElement],{hasValue:!1,elements:{},initialElements:0,prepend:!1,counter:0,templateConfig:{},templateElement:null,templateName:"_TEMPLATE_",templateNameRegExp:null,type:"FormElementMultipleFields"},{initialize:function(e,t){Forms.FormElement.prototype.initialize.apply(this,arguments),this.elements={},t.templateElement.parentName=this.name,this.templateNameRegExp=new RegExp(this.templateName,"g"),this.templateConfig=$.extend(!0,{},t.templateElement),this.templateElement=Forms.BuildFormElement(e,t.templateElement);for(var r=this.counter=0;r<this.initialElements;r++){var n=$.extend(!0,{},this.templateConfig);n.name=n.name.replace(this.templateNameRegExp,r),n.idPart&&(n.idPart=n.idPart.replace(this.templateNameRegExp,r));n=Forms.BuildFormElement(e,n);this.elements[n.name]=n,this.counter++}},setValue:function(){return this},getValue:function(){},clearErrors:function(){for(var e in this.elements){var t=this.elements[e];Forms.Util.IsFunction(t.clearErrors)&&t.clearErrors()}},showErrors:function(e){for(var t in e=e||{}){var r=this.name+"_"+t;this.elements[r]?(r=this.elements[r],Forms.Util.IsFunction(r.showErrors)&&r.showErrors(e[t])):Forms.FormElement.prototype.showErrors.call(this,e[t])}return this},addElement:function(){var e=this.counter;this.cloneTemplateElement(e);var t=$.extend(!0,{},this.templateConfig);t.name=t.name.replace(this.templateNameRegExp,e),t.idPart&&(t.idPart=t.idPart.replace(this.templateNameRegExp,e));t=Forms.BuildFormElement(this.id,t);return this.elements[t.name]=t,this.getForm().addFormElement(t),this.counter++,t},removeElement:function(e){return this.elements[e]&&(this.getForm().removeFormElement(e),delete this.elements[e]),this},deleteElement:function(e){var t;return this.elements[e]&&(t=this.elements[e].getDomElement(),this.removeElement(e),$(t).remove()),this},cloneTemplateElement:function(e){var t=$("#"+this.templateElement.id),r=t.clone(),n=(n=$("<div></div>").append(r).html()).replace(this.templateNameRegExp,e),r=$(n).show();return this.prepend?t.parent().prepend(r):t.parent().append(r),r}}),Forms.RegisterFormElement("FormElementMultipleFields",Forms.FormElementMultipleFields),Forms.FormElementImagesUploader=Forms.Class([Forms.FormElement],{type:"FormElementImagesUploader",images:[]},{initialize:function(){for(var e in Forms.FormElement.prototype.initialize.apply(this,arguments),this.$uploader=$("input[name="+this.name+"]").closest(".images-uploader"),this.$previewList=this.$uploader.find(".uploads-list"),this.$previewTemplate=this.$uploader.find(".preview-template").detach().clone().removeClass("preview-template"),this._initFileUploader(),this._addEventHandlers(),this.images){var t=this._createImagePreview(this.images[e]);this.$previewList.append(t)}},getValue:function(){var o={},e=$(this.getDomElement()).closest(".images-uploader").find(".uploads-list"),i=new RegExp("^"+this.name+"_([0-9]+)_");return e.find("input").each(function(e,t){var r=$(t),n=r.attr("name"),t=r.val(),r=n.match(i)||[];1<r.length&&(n=n.substr(r[0].length),o[r=r[1]]||(o[r]={}),o[r][n]=t)}),o},_showLoader:function(){this.$uploader.find(".loader").addClass("loading")},_hideLoader:function(){this.$uploader.find(".loader").removeClass("loading")},_initFileUploader:function(){var e=this.$uploader.find("input[type=file]"),r=this;e.fileupload({autoUpload:!0,formData:{},replaceFileInput:!0,dataType:"json"}),e.on("fileuploadsend",function(e,t){r._showLoader()}).on("fileuploadalways",function(e,t){r._hideLoader()}).on("fileuploaddone",function(e,t){t=r._getFileDataFromResponse(t);t&&(t=r._createUploadPreview(t),r.$previewList.append(t))})},_getFileDataFromResponse:function(e){if(!e||!e.result)return null;var t=this.name,t=e.result[t]||[];return t.length?t[0]||null:void 0},_addEventHandlers:function(){this.$previewList.on("click",".btn-delete",function(e){return $(this).closest(".preview-upload").remove(),!1})},_createUploadPreview:function(e){var t=this.$previewTemplate.clone(),r=this.name+"_"+parseInt(1e10*Math.random(),10),n=e.url,e=e.url_preview||n;return t.find("input").attr("name",r+"_src").val(n),t.find(".preview-holder").append('<img src="'+e+'">'),t},_createImagePreview:function(e){var t=this.$previewTemplate.clone(),r=this.name+"_"+e.id;return t.find("input").attr("name",r+"_src").val(e.src),t.find(".preview-holder").append('<img src="'+e.src+'">'),t}}),Forms.RegisterFormElement("FormElementImagesUploader",Forms.FormElementImagesUploader),Forms.ModalAjaxForm=Forms.Class([Forms.AjaxForm],{modalOptions:null,formType:"ModalAjaxForm"},{initialize:function(){Forms.AjaxForm.prototype.initialize.apply(this,arguments);var e=this.getDomElement(),t=$(e),r={formApi:this};t.on("getFormDataSuccess getFormDataError",r,function(e){var t=e.data.formApi;t.showForm(),t.hideOverlay(),"getFormDataError"==e.type&&t.resetForm()}).on("saveFormDataCancel",r,function(e){e=e.data.formApi;e.hideOverlay(),e.hideForm()}).on("submit",r,function(e){e.data.formApi.showOverlay()}).on("saveFormDataError",r,function(e){e.data.formApi.hideOverlay()}).on("saveFormDataSuccess",r,function(e){e=e.data.formApi;e.hideOverlay(),e.hideForm()});var n={backdrop:!0,container:"body"},e=this.modalOptions||{},n=$.extend(n,e,t.data());this.$modal=t.modalwrapper(n).on("shown.modalwrapper hide.modalwrapper",r,function(e){var t="shown"==e.type?"ajaxFormOpen":"ajaxFormClose",t=$.Event(t);$(this).trigger(t,[e.data.formApi]),t.isDefaultPrevented()&&e.preventDefault()})},showForm:function(){return this.$modal.modalwrapper("show"),this},hideForm:function(){return this.$modal.modalwrapper("hide"),this},showOverlay:function(){return this},hideOverlay:function(){return this},showFormAndGetData:function(e){return this.showOverlay(),this.getFormData(e),this},showFormAndFillData:function(e){return this.fillFormData(e||{}),this.showForm(),this.hideOverlay(),this},showFormAndReset:function(){return this.showForm(),this.resetForm(),this.hideOverlay(),this}}),Forms.loadAsyncForm=function(t,e,r){var n;"string"==typeof t&&""!=t&&(void 0===window[t]||null===window[t]?null!==window[t]&&(window[t]=null,n="/api/LoadForm.php?formName="+t,window.urlFingerpint&&(n+="&fingerprint="+window.urlFingerpint),MakeRequest(n,e,function(e){e.head&&$(document.body).append(e.head),e.body&&$(document.body).append(e.body),"function"==typeof r&&r(window[t])})):"function"==typeof r&&r(window[t]))};