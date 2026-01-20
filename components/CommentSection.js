"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useParams } from "next/navigation";

export default function CommentSection() {
  const { slug } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  
  // DÜZENLEME STATE'LERİ
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // STATE: Kullanıcı daha önce yorum yapmış mı?
  const [hasCommented, setHasCommented] = useState(false);

  useEffect(() => {
    // Önce kullanıcıyı bul, sonra yorumları çek
    const initData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        fetchComments(user?.id); // Kullanıcı ID'sini fonksiyona yolla
    };
    
    initData();
  }, [slug]);

  const fetchComments = async (currentUserId) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('book_slug', slug)
      .order('created_at', { ascending: false });
    
    if (data) {
        setComments(data);
        // Dedektif iş başında: Listede bu kullanıcının ID'si var mı?
        if (currentUserId) {
            const exists = data.some(comment => comment.user_id === currentUserId);
            setHasCommented(exists);
        }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) return alert("Yorum yapmak için giriş yapmalısın!");

    const userName = user.user_metadata?.username || user.email.split('@')[0];

    const { error } = await supabase.from('comments').insert({
      book_slug: slug,
      user_id: user.id,
      user_name: userName,
      content: newComment
    });

    if (!error) {
      setNewComment("");
      fetchComments(user.id); // Listeyi ve durumu güncelle
    } else {
      // Eğer SQL tarafında bir şekilde engellenirse buraya düşer
      if (error.code === '23505') { // Unique constraint hatası kodu
          alert("Bu kitaba zaten yorum yaptın! Eski yorumunu düzenleyebilirsin.");
      } else {
          alert("Hata: " + error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Bu yorumu silmek istediğine emin misin?")) return;

    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) {
      // Silince "tekrar yorum yapabilir" durumuna gelmesi lazım
      setHasCommented(false); 
      fetchComments(user?.id);
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const saveEdit = async (id) => {
    const { error } = await supabase
      .from('comments')
      .update({ content: editText })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchComments(user?.id);
    }
  };

  return (
    <div className="mt-12 pt-12 border-t border-gray-100">
      <h3 className="font-black text-[#202020] text-xs uppercase tracking-[0.2em] mb-8">Okuyucu Yorumları</h3>

      {/* --- MANTIK KISMI --- */}
      {!user ? (
          // DURUM 1: Giriş yapmamış
          <div className="mb-12 p-6 bg-gray-50 rounded-2xl text-center text-sm text-gray-500">
              Yorum yapmak için giriş yapmalısın.
          </div>
      ) : hasCommented ? (
          // DURUM 2: Zaten yorum yapmış
          <div className="mb-12 p-4 bg-blue-50 text-[#00537d] rounded-2xl text-center text-sm font-bold border border-blue-100 flex flex-col items-center gap-2">
              <span className="material-icons">check_circle</span>
              <p>Bu kitap hakkındaki düşünceni zaten paylaştın.</p>
              <p className="text-xs font-normal opacity-70">Fikrin değiştiyse aşağıdan yorumunu düzenleyebilirsin.</p>
          </div>
      ) : (
          // DURUM 3: Giriş yapmış VE henüz yorum yapmamış (Formu Göster)
          <form onSubmit={handleAddComment} className="mb-12 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#00537d] flex items-center justify-center text-white shrink-0 font-bold uppercase text-xs">
              {user.email[0]}
            </div>
            <div className="flex-1">
               <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Bu kitap hakkında ne düşünüyorsun?" 
                  // DÜZELTİLDİ: min-h-[100px] yerine min-h-25
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#00537d] min-h-25 resize-none"
               />
               <div className="flex justify-end mt-2">
                  <button type="submit" className="px-6 py-2 bg-[#202020] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#00537d] transition">
                      Gönder
                  </button>
               </div>
            </div>
          </form>
      )}

      {/* YORUM LİSTESİ */}
      <div className="space-y-8">
        {comments.length === 0 && <p className="text-gray-400 text-sm italic">Henüz yorum yapılmamış. İlk sen ol!</p>}

        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 font-bold uppercase text-xs">
                {comment.user_name?.[0] || "?"}
             </div>
             
             <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#202020] text-sm">{comment.user_name}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                    </span>
                </div>

                {editingId === comment.id ? (
                    <div className="mt-2">
                        <textarea 
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-3 border border-[#00537d] rounded-xl text-sm bg-white"
                            rows="3"
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => saveEdit(comment.id)} className="text-xs font-bold text-white bg-[#00537d] px-3 py-1 rounded">Kaydet</button>
                            <button onClick={() => setEditingId(null)} className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded">İptal</button>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                        
                        {user && user.id === comment.user_id && (
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white pl-2">
                                <button onClick={() => startEditing(comment)} className="text-blue-500 hover:text-blue-700" title="Düzenle">
                                    <span className="material-icons text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDelete(comment.id)} className="text-red-400 hover:text-red-600" title="Sil">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}