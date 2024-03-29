(defun helios->new-pkg-name (name)
  (let* ((parts (s-split "_" name t))
         (prefix (car parts))
         (rpc-name-camel (second parts))
         (rpc-name-dash (and rpc-name-camel (s-dashed-words rpc-name-camel))))
    (and rpc-name-dash (concat "@fluent-wallet/" prefix "_" rpc-name-dash))))

(defun helios-pkg-p ()
  (let ((name (buffer-file-name)))
    (and (string= (file-name-nondirectory name) "package.json")
         (string-match-p "helios/packages/" name)
         (not (save-excursion
                (goto-char (point-min))
                (re-search-forward "\"private\": true" nil t))))))

(defun helios-set-pkg-type ()
  (interactive)
  (when (helios-pkg-p)
    (save-excursion
      (goto-char (point-min))
      (let* ((no-type-p (not (re-search-forward "\"type\":" nil t)))
             (name-line-end (and no-type-p (re-search-forward "\"name\":.*$"))))
        (when no-type-p
          (goto-char name-line-end)
          (let* ((has-comma (= 44 (char-before name-line-end)))
                 (to-insert "\n  \"type\": \"module\"")
                 (to-insert (if has-comma (concat to-insert ",") (concat "," to-insert))))
            (insert to-insert)))))))

(defun helios-set-pkg-main ()
  (interactive)
  (when (helios-pkg-p)
    (save-excursion
      (goto-char (point-min))
      (let* ((no-main-p (not (re-search-forward "\"main\":" nil t)))
             (name-line-end (and no-main-p (re-search-forward "\"name\":.*$"))))
        (when no-main-p
          (goto-char name-line-end)
          (let* ((has-comma (= 44 (char-before name-line-end)))
                 (to-insert "\n  \"main\": \"index.js\"")
                 (to-insert (if has-comma (concat to-insert ",") (concat "," to-insert))))
            (insert to-insert)))))))

(defun helios-set-pkg-version ()
  (interactive)
  (when (helios-pkg-p)
    (save-excursion
      (goto-char (point-min))
      (let* ((no-version-p (not (re-search-forward "\"version\":" nil t)))
             (insert-pos (and no-version-p (re-search-forward "\"\n"))))
        (when (and no-version-p insert-pos)
          (goto-char (- insert-pos 1))
          (insert ",")
          (forward-char)
          (insert "  \"version\": \"0.0.0\"\n"))))))


(defun helios-change-pkg-readme (old-name new-name)
  (let ((readmef (concat (file-name-directory (buffer-file-name)) "README.md")))
    (when (and old-name new-name (f-file? readmef))
      (with-current-buffer (find-file-noselect readmef)
        (save-excursion
          (goto-char (point-min))
          (re-search-forward old-name nil t)
          (replace-match new-name)
          (save-buffer))))))

(defun helios-change-pkg-name ()
  (interactive)
  (when (helios-pkg-p)
    (save-excursion
      (goto-char (point-min))
      (let* ((rpcpkgp (re-search-forward "\"name\":\s\"\\(txpool\\|wallet\\|cfx\\|eth\\|net\\|web3\\|personal\\)_" nil t))
             (name-start (and rpcpkgp (goto-char (point-min)) (re-search-forward "\"name\":\s\"")))
             (name (thing-at-point 'sexp t))
             (new-name (and name (helios->new-pkg-name name))))
        (when (and rpcpkgp name new-name)
          (re-search-forward "\\(txpool\\|wallet\\|cfx\\|eth\\|net\\|web3\\|personal\\)_\\w+" nil t)
          (replace-match new-name)
          (helios-change-pkg-readme name new-name))))))

(defun helios-setup-pkg-json ()
  (interactive)
  (when (helios-pkg-p)
    (helios-change-pkg-name)
    (helios-set-pkg-main)
    (helios-set-pkg-type)
    (helios-set-pkg-version)
    (save-buffer)))

(add-hook! json-mode 'helios-setup-pkg-json)

(defun helios-setup-rpc-indexjs ()
  (interactive)
  (let ((path (buffer-file-name)))
    (when (and path (string-match-p "packages/rpcs/\\(txpool\\|wallet\\|cfx\\|eth\\|net\\|web3\\|personal\\)_\\w+/index.js" path))
      (let* ((rpc-name (with-temp-buffer
                         (insert path)
                         (goto-char (point-max))
                         (let* ((start (re-search-backward "\\(txpool\\|wallet\\|cfx\\|eth\\|net\\|web3\\|personal\\)_\\w+"))
                                (end (- (search-forward "/" (buffer-file-name)) 1)))
                           (buffer-substring start end))))
             (imspec (concat "import {map} from '@fluent-wallet/spec'\n\n"))
             (name (concat "export const NAME = '" rpc-name "'\n\n"))
             (schemas (concat "export const schemas = {\n  input: [],\n}\n\n"))
             (perms (concat "export const permissions = {\n  external: ['popup', 'inpage'],\n  locked: true,\n  methods: [],\n  db: [],\n}\n\n"))
             (main (concat "export const main = ({Err: {}, db: {}, rpcs: {}, f, params: {}}) => {\n  \n}")))
        (save-excursion
          (goto-char (point-min))
          (when (not (re-search-forward "from.*@fluent-wallet/spec" nil t))
            (insert imspec))
          (when (not (re-search-forward "export.*const.*NAME" nil t))
            (insert name))
          (when (not (re-search-forward "export.*const.*schemas" nil t))
            (insert schemas))
          (when (not (re-search-forward "export.*const.*permissions" nil t))
            (insert perms))
          (when (and (not (re-search-forward "export.*const.*main" nil t))
                     (not (re-search-forward "export.*function.*main" nil t)))
            (insert main)))))))

(add-hook! js2-mode 'helios-setup-rpc-indexjs)

(after! lsp-mode
  (add-to-list 'lsp-file-watch-ignored-directories "[/\\\\]browser-extension"))