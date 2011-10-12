set ffs=unix
set autoread
set autowriteall
au FileType javascript setlocal ts=4 sts=4 sw=4  expandtab
fun LoadAllFiles()
    for line in split(system('find resources/ -name "*.js"'),'\n')
        silent execute 'edit '.line 
    endfor
endfun
if argc() == 0
    au VimEnter * nested call LoadAllFiles()
    au VimEnter * silent execute 'NERDTree'
endif
"Fix jslint so it respects my config
function FixJslintChecker()
    function! SyntaxCheckers_javascript_GetLocList()
        let makeprg = "jsl -conf jsl.conf -nologo -nofilelisting -nosummary -nocontext -process ".shellescape(expand('%'))
        let errorformat='%W%f(%l): lint warning: %m,%-Z%p^,%W%f(%l): warning: %m,%-Z%p^,%E%f(%l): SyntaxError: %m,%-Z%p^,%-G'
        return SyntasticMake({ 'makeprg': makeprg, 'errorformat': errorformat })
    endfunction
endfunction
au VimEnter * silent call FixJslintChecker()
