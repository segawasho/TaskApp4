module.exports = {
  content: [
    './app/views/layouts/application.html.erb',
    './app/views/home/top.html.erb',
    './app/views/home/tasks.html.erb',
    './app/views/home/status_master.html.erb',
    './app/views/home/memos.html.erb',
    './app/views/home/company_master.html.erb',
    './app/views/home/category_master.html.erb',

    './app/javascript/components/CategoryMaster.jsx',
    './app/javascript/components/CommentSection.jsx',
    './app/javascript/components/CompanyMaster.jsx',
    './app/javascript/components/MemoEditor.jsx',
    './app/javascript/components/MemoList.jsx',
    './app/javascript/components/Modal.jsx',
    './app/javascript/components/StatusMaster.jsx',
    './app/javascript/components/TaskList.jsx',

    './app/javascript/packs/category_master.jsx',
    './app/javascript/packs/company_master.jsx',
    './app/javascript/packs/memo_list.jsx',
    './app/javascript/packs/status_master.jsx',
    './app/javascript/packs/task_list.jsx',


  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
