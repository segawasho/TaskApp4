import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';

const CommentSection = ({ taskId,user }) => {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await authFetch(`/api/tasks/${taskId}/progress_comments`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('コメントの取得に失敗', err);
      }
    };
    fetchComments();
  }, [taskId]);

  const handleAddComment = () => {
    authFetch(`/api/progress_comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: taskId,
        content: newCommentContent
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('コメント投稿失敗');
        return res.json();
      })
      .then(data => {
        setComments(prev => [data, ...prev]);
        setNewCommentContent('');
        showToast('コメントを追加しました', 'success');
      })
      .catch(err => {
        console.error('コメント追加エラー:', err);
        showToast('コメントの追加に失敗しました', 'error');
      });
  };


  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  const handleUpdateComment = (commentId) => {
    authFetch(`/api/progress_comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editedCommentContent })
    })
      .then(res => {
        if (!res.ok) throw new Error('更新失敗');
        return res.json();
      })
      .then(updated => {
        setComments(prev =>
          prev.map(c => (c.id === commentId ? updated : c))
        );
        setEditingCommentId(null);
        setEditedCommentContent('');
        showToast('コメントを更新しました', 'success');
      })
      .catch(err => {
        console.error('コメント更新エラー:', err);
        showToast('コメントの更新に失敗しました', 'error');
      });
  };


  const handleDeleteComment = (commentId) => {
    openModal(
      <div className="text-center space-y-4">
        <p>このコメントを削除してもよろしいですか？</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              authFetch(`/api/progress_comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
              })
                .then(() => {
                  setComments(prev => prev.filter(c => c.id !== commentId));
                  showToast('コメントを削除しました', 'success');
                  closeModal();
                })
                .catch(err => {
                  console.error('コメント削除エラー:', err);
                  showToast('削除に失敗しました', 'error');
                  closeModal();
                });
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            はい
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  };


  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAddComment();
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {/* コメント一覧 */}
      <ul className="space-y-2">
        {comments.map(comment => (
          <li key={comment.id} className="bg-gray-50 border border-gray-200 rounded p-3 text-sm">
            {editingCommentId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditedCommentContent('');
                    }}
                    className="bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <p className="text-gray-700 flex-1 whitespace-pre-wrap">{comment.content}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditComment(comment.id, comment.content)}
                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* コメント入力欄 */}
      <div className="flex gap-2">
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="コメントを入力（Ctrl+Enterで送信）"
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
          rows={2}
        />
        <button
          onClick={handleAddComment}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
        >
          送信
        </button>
      </div>
    </div>
  );


};

export default CommentSection;
