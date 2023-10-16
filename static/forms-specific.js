


/* -------- SITE-SPECIFIC FORMS BEGIN -------- */
$.extend(Forms.FormWrapper.prototype,
{
  appendFormWarning: function(message)
  {
    if (!message || typeof message !== 'string')
      return this;
    
    if (message.replace(/(^[ ]+)|([ ]+$)/g, '')) {
        $(this.getDomElement())
          .find('.generic-error-container')
          .append('<div class="generic-message warn"><b></b>' + message + '</div>');
    }
    return this;
  },
  setReadonlyPermission: function(state)
  {
    var formApi = this;
    formApi._permisive_submit_state = state;
    if (!this._preprocess_added) 
    {
      this._preprocess_added = true;
      $(this.getDomElement()).bind('ajaxFormOpen', function()
      {
        if (formApi._permisive_submit_state) {
          $(formApi.getDomElement()).find('.generic-error-container > .warn').remove();
          formApi.appendFormWarning("You are allowed to view, but have no permission to change.");
        }
      });
      
    }
  }
});



Forms.FormElementSelectMultiple = Forms.Class(
  [Forms.FormElement],
  {
    type: 'FormElementSelectMultiple'
  },
  {
    initialize: function()
    {
      Forms.FormElement.prototype.initialize.apply(this, arguments);
    },
    setValue: function(value)
    {
      if (typeof value == 'string' && value.indexOf(',') > 0)
        value = value.split(',');
      
      if (!value)
        value = [];
      
      Forms.FormElement.prototype.setValue.call(this, value);
      return this;
    },
    getValue: function()
    {
      var value = Forms.FormElement.prototype.getValue.call(this);
      
      if (value && typeof value.join == 'function')
        value = value.join(',');
      return value;
    }
  }
);
Forms.RegisterFormElement('FormElementSelectMultiple',
  Forms.FormElementSelectMultiple);

Forms.RegisterFormElement('FormElementWorkhours', Forms.FormElementSubform);

Forms.RegisterFormElement('FormElementMapCoordinates', Forms.FormElementSubform);

Forms.FormElementDictionary = Forms.Class(
  [Forms.FormElementMultipleFields],
  {
    type: 'FormElementDictionary'
  },
  {
    initialize: function() 
    {
      Forms.FormElementMultipleFields.prototype.initialize.apply(this, arguments);
    },
    toObject: function(arr)
    {
      var obj = {};
      for (var i in arr)
        obj[arr[i].name] = arr[i].value;
      return obj;
    },
    fromObject: function(obj)
    {
      var arr = [];
      for (var key in obj)
        arr.push({name: key, value: obj[key]});
      return arr;
    },
    resetElements: function()
    {
      for (var n in this.elements)
        this.deleteElement(n);
      this.counter = 0;
      return this;
    },
    prepareElementsData: function(data)
    {
      this.resetElements();
      for (var n in data)
        this.addElement();
      
      return this;
    },
    setValue: function(arr)
    {
      this.resetElements(arr);
      for (var i = 0, len = arr.length; i < len; i++)
      {
        var pair = arr[i];
        var nvp = this.addElement();
        for (var k in nvp.elements)
        {
          var el = nvp.elements[k];
          
          if (el.originalName == 'value')
            el.setValue(pair.value);
          else if (el.originalName == 'name')
            el.setValue(pair.name);
        }
      }
      
      return this;
    },
    fillData: function(obj)
    {
      var arr = this.fromObject(obj);
      this.setValue(arr);
      return this;
    },
    getValue: function()
    {
      var name, value, arr = [];
      for (var x in this.elements)
      {
        var nvp = this.elements[x];
        name = value = null;
        for (var k in nvp.elements)
        {
          var e = nvp.elements[k];
          if (e.originalName == 'name')
            name = e.getValue();
          else if (e.originalName == 'value')
            value = e.getValue();
        }
        
        if (name !== null)
          arr.push({'name': name, 'value': value});
      }
      return arr;
    },
    collectData: function()
    {
      var arr = this.getValue();
      return this.toObject(arr);
    }
  }
  
);

Forms.RegisterFormElement('FormElementNameValuePair', Forms.FormElementSubform);
Forms.RegisterFormElement('FormElementDictionary', Forms.FormElementDictionary);

Forms.FormElementCustomHtml = Forms.Class(
  [Forms.FormElement],
  {
    type: 'FormElementCustomHtml'
  },
  {
    initialize: function()
    {
      Forms.FormElement.prototype.initialize.apply(this, arguments);
    },
    getValue: function()
    {
      var domEl = this.getDomElement();
      if (domEl && domEl.nodeType)
        return domEl.innerHTML;
      return null;
    },
    setValue: function(value)
    {
      var domEl = this.getDomElement();
      if (domEl && domEl.nodeType)
        domEl.innerHTML = value;
      
      return this;
    }
  }
);
//  Forms.RegisterFormElement('FormElementCustomHtml', Forms.FormElementCustomHtml);
/* -------- SITE-SPECIFIC FORMS END -------- */



Forms.FormElementPhotoUpload = Forms.Class([Forms.FormElementSubform], 
{
  hasValue: false,
  type: 'FormElementPhotoUpload',
  
  srcResponseParameter: 'url',
  thumbResponseParameter: 'url_thumb',
  previewResponseParameter: 'url_preview',
  
  
}, {
  initialize: function(name, options)
  {
    Forms.FormElementSubform.prototype.initialize.apply(this, arguments);
    
    this._initElements();
    this._initFileupload(options);
  },
  _initElements: function()
  {
    var _this = this;
    
    // aliases
    _this.thumb = _this.elements['thumb'];
    _this.src = _this.elements['src'];
    
    // define setValue function
    _this.thumb.setValue = $.proxy(this.setThumbValue, this);


    _this.$thumbField = $(this.thumb.getDomElement());
    // listen click on remove button if found
    _this.$thumbField.on('click', '.btn-delete', function(e)
    {
      e.preventDefault();
      
      _this.src.setValue();
      _this.thumb.setValue();
    });
  },
  
  _initFileupload: function(options)
  {
    var $el = $(this.getDomElement());
    var $file = $el.find('input.file');
    
    $file.fileupload({
      autoUpload: true,
      formData: {},
      replaceFileInput: true,
      dataType: 'json'
    });
    
    var _this = this;
    
    $file
    .on('fileuploadsend', function(e, data)
    {
      _this.thumb.setValue();
    
      _this._updateProgress(0);
      _this._showLoader();
    })
    .on('fileuploadprogress', function(e, data) {
      _this._updateProgress(data);
    })
    .on('fileuploadfail', function(e, data) {
      _this._hideLoader();
    })
    .on('fileuploaddone', function(e, data)
    {
      var file = _this._getFileDataFromResponse(data);
      
      var srcUrl = file[_this.srcResponseParameter];
      var thumbUrl = file[_this.thumbResponseParameter] || srcUrl;

      _this.src.setValue(srcUrl);
      _this.thumb.setValue(thumbUrl);
    })
    .on('fileuploadalways', function(e, data) {
      _this._updateProgress(100);
    })
    
  },
  
  setThumbValue: function(value)
  {
    var $field = this.$thumbField;
    var $placeholder = $field.find('.thumb-placeholder');
    
    $placeholder.html('');
    $field.toggleClass('has-file', !!value);
    
    if (value)
    {
      var _this = this;
      _this._showLoader();
      var img = document.createElement('img');
      img.onload = img.onerror = function()
      {
        this.onload = this.onerror = null;

        _this._hideLoader();
        $placeholder.html(this);
      };

      img.src = value;
    }
  },
  
  _getFileDataFromResponse: function(data)
  {
    if (!data || !data.result)
      return null;
    
    var fieldName = this.name + '_file';
    var files = data.result[fieldName] || [];
    if (!files.length)
      return;
    
    return files[0] || null;
  },
  
  
  // ThumbLoader BEGIN
  _getLoader: function() {
    return $(this.getDomElement()).find('.loader');
  },
  _showLoader: function() {
    this._getLoader().addClass('loading');
  },
  _hideLoader: function() {
    this._getLoader().removeClass('loading');
  },
  // ThumbLoader END
  
  
  // ProgressBar BEGIN
  _updateProgress: function(data)
  {
    var value = 0;
    if (typeof data === 'object')
      value = parseInt(data.loaded / data.total * 100, 10)
    else if (typeof data === 'number')
      value = data;
    
    // temporary disabled
    $(this.getDomElement()).find('.progress-loaded').width(value + '%');
  }
  // ProgressBar END
  
});


Forms.RegisterFormElement('FormElementPhotoUpload', Forms.FormElementPhotoUpload);





Forms.FormElementAdminImagesUploader = Forms.Class(
  [Forms.FormElement],
  {
    type: 'FormElementAdminImagesUploader',
    images: [],
    presets: {},
  },
  {
    initialize: function()
    {
      Forms.FormElement.prototype.initialize.apply(this, arguments);
      
      this.$uploader = $('input[name='+this.name+']').closest('.admin-uploader');
      this.$previewList = this.$uploader.find('.uploads-list');
      
      this.$previewTemplate = this.$uploader.find('.template')
        .detach()
        .clone()
        .removeClass('template');
      
      this._initFileUploader();
      this._addEventHandlers();
      
      // populate with images from database
      for (var image in this.images)
      {
        var $imagePreview = this._createImagePreview(this.images[image]);
        this.$previewList.append($imagePreview);
      }
      
      this._recalculateWeights();
      this.presetsEditor = new PresetsEditor(this.presets, this.imageType);
    },
    
    getValue: function()
    {
      var values = {}, // set values as object
          $list = $(this.getDomElement()).closest('.admin-uploader').find('.uploads-list'),
          sanitizer = new RegExp('^' + this.name + '_([0-9]+)_');
      
      $list.find('input').each(function(key, el)
      {
        var id, $el = $(el), name = $el.attr('name'), val = $el.val();
        // remove name and id part
        var matches = name.match(sanitizer) || [];

        if (matches.length > 1)
        {
          name = name.substr(matches[0].length);
          id = matches[1];
          if (!values[id]) // lazy init sub-object
            values[id] = {};
          
          values[id][name] = val;
        }
      });

      return values;
    },
    
    addTempImage: function (tempImageUrl)
    {
      var fileData = {
        url: tempImageUrl,
        url_thumb: tempImageUrl
      };
      
      var $uploadPreview = this._createUploadPreview(fileData);
      this.$previewList.append($uploadPreview);
  
      this._recalculateWeights();
    },
    
    // ********** Private methods begin **********
    
    _showLoader: function() {
      this.$uploader.find('.loader').addClass('loading');
    },

    _hideLoader: function() {
      this.$uploader.find('.loader').removeClass('loading');
    },
    
    _initFileUploader: function()
    {
      var $file = this.$uploader.find('input[type=file]');
      var self = this;
      
      $file.fileupload({
        autoUpload: true,
        formData: {},
        replaceFileInput: true,
        dataType: 'json',
      });
      
      $file
        .on('fileuploadsend', function(e, data)
        {
          self._showLoader();
        })
        .on('fileuploadalways', function(e, data)
        {
          self._hideLoader();
        })
        .on('fileuploaddone', function(e, data)
        {
          var fileData = self._getFileDataFromResponse(data);
          if (!fileData)
            return;
          
          var $uploadPreview = self._createUploadPreview(fileData);
          self.$previewList.append($uploadPreview);
          
          self._recalculateWeights();
        });
    },

    _getFileDataFromResponse: function(data)
    {
      if (!data || !data.result)
        return null;

      var fieldName = this.name;
      var files = data.result[fieldName] || [];
      if (!files.length)
        return;

      return files[0] || null;
    },
    
    _addEventHandlers: function()
    {
      var self = this;
      
      // drag&drop sorting
      dragula(self.$previewList.get())
        .on('drop', function(draggedEl) {
          self._recalculateWeights();
          self._markAsUnsaved($(draggedEl));
        });
        
      // captions editing
      self.$previewList.on('click', '.btn-captions', function(event) {
        event.preventDefault();
        var data = {};
        var $this = $(this);
        
        var $inputs = $this.closest('.admin-upload-preview').find('input[class^="caption"]');
        
        $inputs.each(function(key, elem) {
          var name = $(elem).attr("name").match(/caption.+$/i);
          data[name] = $(elem).val();
        });
        
        $this.trigger("showCaptionsForm", [data, $inputs]);
        self._markAsUnsaved($this);
      });
      
      // main image selection
      self.$previewList.on('click', '.btn-set-main', function(event) {
        event.preventDefault();
        
        var $previews = $('.admin-upload-preview');
        $previews.find('.btn-set-main').removeClass('selected');
        $previews.find('input.is-main-image').val(0);
        
        $(this)
          .addClass('selected')
          .closest('.admin-upload-preview')
          .find('input.is-main-image')
          .val(1);
        
        self._markAsUnsaved($(this));
      });
      
      // watermark toggling
      self.$previewList.on('click', '.btn-watermark', function(event) {
        event.preventDefault();
        
        var $input = $(this).closest('.admin-upload-preview').find('input.has-watermark'),
            newVal = $input.val() == '1' ? '0' : '1';
        
        $(this).toggleClass('selected');
        $input.val(newVal);
        self._markAsUnsaved($input);
      });
      
      // image deletion
      self.$previewList.on('click', '.btn-delete', function(e)
      {
        $(this).closest('.admin-upload-preview').remove();
        return false;
      });
      
      // presets editing
      self.$previewList.on('click', '.btn-presets', function(event)
      {
        event.preventDefault();
        var $clickedPreview = $(this).closest('.admin-upload-preview');
        var $presetsConfigsInput = $clickedPreview.find('input.presets-configs');
        
        var referenceImageUrl = $clickedPreview.data('referenceImageUrl');
        var mediaFileId = $clickedPreview.data('mediaFileId');
        var image = mediaFileId || referenceImageUrl;
        
        var presetsConfigs = JSON.parse($presetsConfigsInput.val());
        
        self.presetsEditor.editImage(image, presetsConfigs)
          .progress(function(editedPresetsConfigs) {
            var newVal = JSON.stringify(editedPresetsConfigs);
            $presetsConfigsInput.val(newVal);
            self._markAsUnsaved($presetsConfigsInput);
          });
      });
    },
    
    _recalculateWeights: function()
    {
      this.$previewList.children().each(function(index) {
        $(this).find('.weight').val(index);
      });
    },
    
    _markAsUnsaved: function($element)
    {
      var $preview = $element;
      
      if (!$preview.hasClass('admin-upload-preview'))
        $preview = $preview.closest('.admin-upload-preview');
        
      $preview.addClass('unsaved');
    },

    _createUploadPreview: function(uploadResult)
    {
      var $preview = this.$previewTemplate.clone();
      var fieldName = this.name + '_' + parseInt((Math.random() * 10000000000), 10);

      var src = uploadResult.url;
      var thumbUrl = uploadResult.url_thumb || uploadResult.url_preview || src;
      
      // data passed to the presets editor
      $preview.data('referenceImageUrl', uploadResult.url);

      $preview
        .addClass('unsaved')
        .find('input.uploaded-file')
        .attr('name', fieldName + '_src')
        .val(src);

      // init captions inputs
      $preview.find('input[class^="caption"]').each(function(key, elem) {
        var captionName = elem.className;
        $(elem).attr('name', fieldName + '_' + captionName);
      });
      
      $preview.find('input.weight')
        .attr('name', fieldName + '_weight')
        .val('0');
      
      $preview.find('input.is-main-image')
        .attr('name', fieldName + '_isMainImage')
        .val('0');
        
      $preview.find('input.has-watermark')
        .attr('name', fieldName + '_hasWatermark')
        .val('0');
      
      var emptyPresetsConfigs = JSON.stringify({});
      $preview.find('input.presets-configs')
        .attr('name', fieldName + '_presetsConfigs')
        .val(emptyPresetsConfigs);
      
      $preview.append('<div class="img-wrapper"><img src="' + thumbUrl + '"></div>');
      
      return $preview;
    },
    
    _createImagePreview: function(imageData)
    {
      var $preview = this.$previewTemplate.clone();
      var fieldName = this.name + '_' + imageData.id;
      
      // data passed to the presets editor
      $preview.data('mediaFileId', parseInt(imageData.id, 10));
      
      $preview.find('input.uploaded-file')
        .attr('name', fieldName + '_src')
        .val(imageData.src);

      // init captions inputs
      $preview.find('input[class^="caption"]').each(function(key, elem) {
        var captionName = elem.className;
        
        $(elem)
          .attr('name', fieldName + '_' + captionName)
          .val(imageData[captionName]);
      });
      
      $preview.find('input.weight')
        .attr('name', fieldName + '_weight')
        .val(imageData.weight);
      
      $preview.find('input.is-main-image')
        .attr('name', fieldName + '_isMainImage')
        .val(imageData.isMainImage);
        
      if (imageData.isMainImage == '1')
        $preview.find('.btn-set-main').addClass('selected');
      
      $preview.find('input.has-watermark')
        .attr('name', fieldName + '_hasWatermark')
        .val(imageData.hasWatermark);
      
      if (imageData.hasWatermark == '1')
        $preview.find('.btn-watermark').addClass('selected');
      
      var presetsConfigsJson = JSON.stringify(imageData.presetConfig || {});
      $preview.find('input.presets-configs')
        .attr('name', fieldName + '_presetsConfigs')
        .val(presetsConfigsJson);
        
      $preview.append('<div class="img-wrapper"><img src="' + imageData.src + '"></div>');
      
      return $preview;
    },
  }
);

Forms.RegisterFormElement('FormElementAdminImagesUploader', Forms.FormElementAdminImagesUploader);


Forms.FormElementEntityPicker = Forms.Class(
  [Forms.FormElement],
  {
    type: 'FormElementEntityPicker',
    btnClasses: 'btn btn-white btn-small',
    apiUrl: '',
    singleSelect: false,
    requestParams: null,
    tableTemplate: '',
    fnRenderRow: null,
    fnTransformResult: null,
    labelColumn: null,
    defaultValue: null
  },
  {
    initialize: function()
    {
      Forms.FormElement.prototype.initialize.apply(this, arguments);
      
      if (!this.fnTransformResult)
        this.fnTransformResult = this.transformSelectionResult();
  
      this._$element = $(this.getDomElement());
      this._initEntityPicker();
      this._addOnChangeEventHandlers();
      this._addPickerTriggerBtn();
    },
  
    /**
     *
     * @param {Number} index
     * @param {String} glue
     * @returns {Function}
     */
    transformSelectionResult: function(index, glue) {
      index = index || 0;
      glue = glue || ',';
    
      return function(selectedItems) {
        return selectedItems.map(function(row) { return row[index]; }).join(glue);
      }
    },
    
    _initEntityPicker: function()
    {
      var self = this;
      
      var entityPickerOptions = {
        'apiUrl': self.apiUrl,
        'singleSelect': self.singleSelect,
        'requestParams': self.requestParams,
        'tableTemplate': self.tableTemplate,
        'fnRenderRow': self.fnRenderRow,
      };
  
      this._$element
        .entityPicker(entityPickerOptions)
        .on('entityPicked', function(event, data) {
          self._setFormElementValue(data.result);
        });
      
      this._pickerInstance = this._$element.data('entityPicker');
    },
    
    _setFormElementValue: function (rawData)
    {
      rawData = rawData || [];
      var elementValue = this.fnTransformResult(rawData);
      
      if (elementValue.length === 0 && this.defaultValue != null)
        elementValue = this.defaultValue.value;
  
      this.setValue(elementValue);
    },
  
    _addOnChangeEventHandlers: function()
    {
      var self = this;
  
      this._$element
        .on('change formElementValueChange', this.updateButtonLabel.bind(this))
        
        // When the element is first initialized with a value,
        // make EntityPiker load and select the entities by their ids
        .one('formElementValueChange', function() {
          var initialValue = self.getValue();
          
          if (initialValue !== '')
          {
            var ids = initialValue.split(',');
            self._pickerInstance.setSelectedEntities(ids, function() {
              self.updateButtonLabel();
            });
          }
          else if (self.defaultValue)
          {
            self._pickerInstance.deselectAll();
            self._setFormElementValue();
          }
        });
    },
    
    _addPickerTriggerBtn: function()
    {
      var self = this;
      
      var labelClass = this.singleSelect ? '' : 'counter';
      var buttonTemplate =
        '<button type="button" class="picker-trigger-btn">'
        + '<span class="' + labelClass + '"></span>'
        + '<i class="fa fa-filter"></i>'
        + '</button>';
  
      this._$button = $(buttonTemplate)
        .insertAfter(this.getDomElement())
        .addClass(this.btnClasses)
        .click(function() {
          var value = self.getValue();
          value = (value.length ? value.split(',') : []);
          
          // In singleSelect mode, search for selected item on modal show
          var searchValue = null;
          if (self.singleSelect && value.length > 0)
            searchValue = value[0];
      
          self._pickerInstance.open(searchValue);
        });
    },
    
    updateButtonLabel: function ()
    {
      var elementValue = this._$element.val();
      var hasSelectedEntities = elementValue.length > 0;
      var isDefaultValueSelected = this.defaultValue != null && elementValue === this.defaultValue.value;
      var $label = this._$button.find('span');
      var label = '';
      
      // Remove selection if nothing selected
      if (!hasSelectedEntities)
        this._pickerInstance.deselectAll();
      
      if (isDefaultValueSelected)
      {
        $label
          .text(this.defaultValue.label)
          .toggle(hasSelectedEntities);
      }
      else if (this.singleSelect)
      {
        if (hasSelectedEntities)
        {
          label = '[' + elementValue +'] ';
          
          // If loaded, also display entity title
          var selectedEntityData = this._pickerInstance.getSelectedEntities().pop();
          
          if (selectedEntityData && this.labelColumn)
            label += selectedEntityData[this.labelColumn];
        }
        
        $label
          .text(label)
          .toggle(hasSelectedEntities);
      }
      else
      {
        if (hasSelectedEntities)
          label = elementValue.split(',').length;
        else
          label = '0';
        
        $label
          .text(label)
          .toggleClass('grayed', !hasSelectedEntities)
          .show();
      }
    }
  }
);

Forms.RegisterFormElement('FormElementEntityPicker', Forms.FormElementEntityPicker);


Forms.FormElementEntities = Forms.Class(
  [Forms.FormElement],
  {
    type: 'FormElementEntities',
    selectedItems: [],
    apiUrl: '',
    singleSelect: false,
    requestParams: null,
    tableTemplate: '',
    fnRenderRow: null,
    fnTransformResult: null
  },
  {
    initialize: function()
    {
      Forms.FormElement.prototype.initialize.apply(this, arguments);

      this._$element = $(this.getDomElement());
      this._$selectionList = this._$element.find('.selected-items-list');
      this._$template = this._$element.find('.template')
        .detach()
        .removeClass('template');
      
      this._initEntityPicker();
      this._addEventHandlers();
      this._setSelectedItems(this.selectedItems);
      this._updatePickerSelection();
    },
  
    getValue: function()
    {
      var values = [];
      
      this._$selectionList.find('input').each(function () {
        values.push($(this).val());
      });
    
      return values;
    },
    
    setValue: function(values)
    {
      if (typeof values === 'string')
      {
        values = values.split(',').map(function(v) {
          return { value: v.trim(), title: '...'};
        });
      }

      values = values || [];

      this._setSelectedItems(values);
      this._updatePickerSelection();

      this._$element
        .trigger('formElementValueChange', [this, values])
        .triggerHandler('change');
      
      return this;
    },
  
    _initEntityPicker: function()
    {
      var self = this;
      
      var entityPickerOptions = {
        'apiUrl': self.apiUrl,
        'singleSelect': self.singleSelect,
        'requestParams': self.requestParams,
        'tableTemplate': self.tableTemplate,
        'fnRenderRow': self.fnRenderRow,
      };
      
      this._$element.find('button')
        .entityPicker(entityPickerOptions)
        .click(function() {
          $(this).data('entityPicker').open();
        })
    },
    
    _addEventHandlers: function ()
    {
      var self = this;
      
      this._$element.find('button')
        .on('entityPicked', function(event, data) {
          var selectedItems = self.fnTransformResult(data.result);
          self._setSelectedItems(selectedItems);
        });
  
      this._$selectionList
        .on('click', '.remove', function() {
          var entityId = $(this).siblings('input').val();
  
          self._$element.find('button')
            .data('entityPicker')
            .deselectEntity(entityId);
          
          $(this).closest('.selected-item').remove();

          self._$element
            .triggerHandler('change');
        });
    },
    
    _setSelectedItems: function (selectedItems)
    {
      this._$selectionList.empty();
      
      for (var i = 0; i < selectedItems.length; i++)
      {
        var item = selectedItems[i];
        var value = item.value || item;
        var title = item.title || '';

        var $item = this._$template.clone();
        var label = '[' + value + ']' + ' ' + title;
        
        $item.find('input')
          .val(value);
        
        $item.find('.item-title')
          .text(label)
          .data('title', title);
  
        this._$selectionList.append($item);
      }

      // Wait until the form has initialized to trigger the change event
      var self = this;
      setTimeout(function() {
        self._$element.triggerHandler('change');
      }, 0);
    },
    
    _updatePickerSelection: function ()
    {
      var selectedEntitiesIds = [];
      
      this._$selectionList.find('.selected-item')
        .each(function () {
          var id = $(this).find('input').val();
          selectedEntitiesIds.push(id);
        });
      
      this._$element.find('button')
        .data('entityPicker')
        .setSelectedEntities(selectedEntitiesIds);
    }
  }
);

Forms.RegisterFormElement('FormElementEntities', Forms.FormElementEntities);
