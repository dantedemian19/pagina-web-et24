$(function(){
  $('body').on('submit', '#create-group', function(e){
    e.preventDefault();

    let group = $('form#create-group input[name="title"]');
    let groupTitle = group.val();

    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {

        group.val('');

        let newProjectHtml = this.responseText;

        let messagesContainer = $('.messages');
        let projectGroupsContainer = $('.project-grouplist');


        let messagesHtml = `<div class="msg scss_c">
                             <p class="msg-d">El grupo se agrego con éxito.</p>
                             <div class="close-msg">
                               <i class="fas fa-times"></i>
                             </div>
                            </div>`

        messagesContainer.html(messagesHtml);
        projectGroupsContainer.append(newProjectHtml);
      }
    }

    request.open("POST", "/users/gestion/proyectos/ngroup", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`title=${groupTitle}`);

  });


  $('body').on('click', '#remove-group', function(e){

    let group = $('.project.selected');

    let groupId = group.attr("id");

    $.ajax({
      url: `/users/gestion/proyectos/grupo/${groupId}`,
      method: "DELETE",
      success: function(){
        group.remove();
        $('.messages').children().remove();

        $('.pj-info').removeClass('enabled');

        $('#group-name').text('desconocido');
        $('#group-date').text('desconocido');
        $('#group-pj').text('desconocido');
        $('#add-project input[name="p-title"]').val('');


        $('#project-list').html('');
      }
    });

  });

  $('body').on('click', 'button.edit', function(){
    let $el = $(this).siblings('span');

    let $input = $('<input/>').val( $el.text() );
    $el.replaceWith( $input );

    let save = function(){

      let $span = $('<span class="f-el" data-editable />').text( $input.val() );

      let group = $(this).parents('.project');
      let groupId = group.attr("id");

      let title = $(this).val();

      if(title == '') return;

      $.ajax({
        url: `/users/gestion/proyectos/grupo/${groupId}`,
        method: "PUT",
        data:{
          groupTitle: title
        },
        success: function(){
          $input.replaceWith( $span );
          $input.off('blur');
          if(group.hasClass('has-info-open')){
            $.ajax({
              url: `/users/gestion/proyectos/grupo/${groupId}`,
              method: "GET",
              success: updateProjectInfo
            });
          }
        }
      });

    };

    $input.on('blur', save).focus();

  });

  $('body').on('click', '.project-grouplist .project span.f-el', function(){
    $('.project-grouplist .project').removeClass('selected has-info-open')
    let group = $(this).parents('.project');
    group.addClass('selected has-info-open');

    let groupId = group.attr('id');

    $.ajax({
      url: `/users/gestion/proyectos/grupo/${groupId}`,
      method: "GET",
      success: updateProjectInfo
    });

  });

  $('body').on('submit', '#add-project', function(e){
    e.preventDefault();

    let newProjectInput = $('#add-project input[name="p-title"]')
    let group = $('.project.selected');

    let newProjectTitle = newProjectInput.val();
    let groupId = group.attr("id");

    $.ajax({
      url: `/users/gestion/proyectos/grupo/${groupId}/nproject`,
      method: "POST",
      data: {
        title: newProjectTitle
      },
      success: updateProjectInfo
    });

  });

  $('body').on('click', '#remove-project', function(){
    let project = $(this).parents('.project');
    let group = $('.project.selected');

    let groupId = group.attr('id');
    let projectId = project.attr('id');

    $.ajax({
      url: `/users/gestion/proyectos/${groupId}/${projectId}`,
      method: "DELETE",
      success: updateProjectInfo
    });

  });

  function updateProjectInfo(data){
    console.log(data);

    let {groupTitle, date, associatedProjects} = data.group;
    let {projectsHtml} = data;


    formattedDate = new Date(date);

    $('.pj-info').addClass('enabled');

    $('#group-name').text(groupTitle);
    $('#group-date').text(`${formattedDate.getDate()}/${formattedDate.getUTCMonth() + 1}/${formattedDate.getFullYear()}`);
    $('#group-pj').text(associatedProjects.length);
    $('#add-project input[name="p-title"]').val('');

    $('#project-list').html(projectsHtml);
  }

  // $( "#dialog-confirm" ).dialog({
  //     autoOpen: false,
  //     resizable: false,
  //     height: "auto",
  //     width: "auto",
  //     fluid: true,
  //     modal: true,
  //     create: function( event, ui ) {
  //       $(this).css("maxWidth", "450px");
  //     },
  //     buttons: {
  //       "Eliminar grupo": function() {
  //
  //
  //         $( this ).dialog( "close" );
  //       },
  //       Cancelar: function() {
  //         $( this ).dialog( "close" );
  //       }
  //     }
  //   });

});
