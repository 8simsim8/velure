  function makeDroppable(element) {

    var indexInput = 0;
    var sumFiles = 0;

    var isClick;

    var wrappTable = document.createElement('div');
    wrappTable.setAttribute('hidden', '');
    wrappTable.classList.add('upload-wrapp-file-container');

    var table = document.createElement('table');
    table.classList.add('upload-file-container');
    wrappTable.appendChild(table);

    element.appendChild(wrappTable);

    element.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      element.classList.add('m-upload-hover');
    });

    element.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('m-upload-hover');
    });

    element.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('m-upload-hover');
      isClick = false;
      triggerCallback(e);
    });
    
    element.querySelector('label').addEventListener('click', function(e) {
      isClick = true;
      e.preventDefault();
      e.stopPropagation();
      triggerCallback(e);
    });

    window.addEventListener('resize', function(){
        var pFiles = element.querySelectorAll('.upload-name-file.text p');
        for(var i = 0; i < pFiles.length; i++) {
            pFiles[i].style.width = element.querySelector('.upload-wrapp-file-container').offsetWidth - 140 + 'px';
        }
    });

    function triggerCallback(e) {

      addFiles(e);

    }

    function addFiles(event){

      var files;

      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('name', 'upload-'+ indexInput + '[]');
      input.setAttribute('multiple', true);
      input.setAttribute('hidden', '');
      input.setAttribute('accept', 'application/pdf, application/msword, image/jpeg, image/png');
      input.classList.add('upload-input');
      element.appendChild(input);

      if(isClick){
        var isCanseled = true;
        input.addEventListener('click', handlerClick);

        /* Отмена выбора по клику */
        window.addEventListener('focus', handlerCancel);
          function handlerCancel() {
            window.removeEventListener('focus', handlerCancel);
            if(isCanseled) {
              input.remove();
            }
          }

        function handlerClick(e){

          input.addEventListener('change', handlerChange);

          function handlerChange(e){
            isCanseled = false;
            if(e.dataTransfer) {
              files = e.dataTransfer.files;
            } else if(e.target) {
              files = e.target.files;
            }
            window.removeEventListener('focus', handlerCancel);
            input.files = files;
            printFiles(files, indexInput);
            indexInput++;
            input.removeEventListener('change', handlerChange);
            input.removeEventListener('click', handlerClick);
          }

          e.stopPropagation();
        }

        input.click();

      } else {

        if(event.dataTransfer) {
          files = event.dataTransfer.files;
        } else if(event.target) {
          files = event.target.files;
        }
        if(files.length > 0) {
          input.files = files;
          printFiles(files, indexInput);
          indexInput++;
        } else {
          input.remove();
        }
        
        event.preventDefault();
        event.stopPropagation();
      }
    }

    function printFiles(files, index){
      element.querySelector('label').classList.add('small');
      wrappTable.removeAttribute('hidden');
      sumFiles += files.length;

      addStringFiles();

      if(sumFiles > 4) {
        if(!element.querySelector('.upload-name-file-sum')){
            wrappTable.classList.add('big-container-files');
            var pSumFiles = document.createElement('p');
            pSumFiles.classList.add('upload-name-file-sum');
            pSumFiles.classList.add('text');

            element.appendChild(pSumFiles);
        }
        element.querySelector('.upload-name-file-sum').innerHTML = 'You add ' + sumFiles + ' files';
      } else {
        if(wrappTable.classList.contains('big-container-files')) {
            wrappTable.classList.remove('big-container-files');
        }
        if(element.querySelector('.upload-name-file-sum')) {
            element.querySelector('.upload-name-file-sum').remove();
        }
      }

      function addStringFiles(){
          for(var i = 0; i < files.length; i++) {
            var tr = document.createElement('tr');
            tr.setAttribute('data-index', index);

            var tdFileName = document.createElement('td');
            var pFileName = document.createElement('p');
            tdFileName.classList.add('upload-name-file');
            tdFileName.classList.add('text');
            pFileName.innerHTML = files[i].name;
            pFileName.style.width = element.querySelector('.upload-wrapp-file-container').offsetWidth - 140 + 'px';

            tdFileName.appendChild(pFileName);
            tr.appendChild(tdFileName);

            var tdWrappButton = document.createElement('td');

            var pButtonRemove = document.createElement('p');

            pButtonRemove.classList.add('remove-file');
            pButtonRemove.classList.add('text');
            pButtonRemove.innerHTML = 'Remove';


            tdWrappButton.appendChild(pButtonRemove);
            tr.appendChild(tdWrappButton);

            table.appendChild(tr);

            pButtonRemove.addEventListener('click', handlerRemoveFile);

            function handlerRemoveFile(e){
                var self = this;
                var i;
                var index = +self.parentNode.parentNode.getAttribute('data-index');
                removeFile(index);
                var strDelete = element.querySelectorAll('[data-index ="' + index + '"]');
                pButtonRemove.removeEventListener('click', handlerRemoveFile);
                for(i = 0; i < strDelete.length; i++) {
                    strDelete[i].remove();
                    sumFiles--;
                }

                if(sumFiles <= 4 ) {
                    if(wrappTable.classList.contains('big-container-files')) {
                        wrappTable.classList.remove('big-container-files');
                    }
                    if(element.querySelector('.upload-name-file-sum')) {
                        element.querySelector('.upload-name-file-sum').remove();
                    }
                } else {
                    if(element.querySelector('.upload-name-file-sum')) {
                        element.querySelector('.upload-name-file-sum').innerHTML = 'You add ' + sumFiles + ' files';
                    }
                }

                e.preventDefault();
                e.stopPropagation();
            }
          }
      }

    }

    function removeFile(index){
      var strName = '[name="upload-' + index + '[]"]';
      var input = element.querySelector(strName);
      input.remove();

      if(!element.querySelectorAll('[type="file"]').length) {
        element.querySelector('label').classList.remove('small');
        wrappTable.setAttribute('hidden','');
      }

    }

  }