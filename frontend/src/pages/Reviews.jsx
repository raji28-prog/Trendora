import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { Search, Star, MessageSquare } from 'lucide-react';
import api from '../services/api.js';

export const Reviews = () => {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reviews');
      setReviews(response.data.data || []);
    } catch (err) {
      if (!err.response) {
        const local = localStorage.getItem('demo_reviews');
        if (local) {
          setReviews(JSON.parse(local));
        } else {
          const defaultReviews = [
            { id: 'rev-1', rating: 5, comment: 'Exceptional service and quick turnaround. Highly recommend Coffee & Co.!', reviewerName: 'John Doe', createdAt: '2026-07-05' },
            { id: 'rev-2', rating: 4, comment: 'Great selection of plants, very helpful staff.', reviewerName: 'Jane Smith', createdAt: '2026-07-04' }
          ];
          localStorage.setItem('demo_reviews', JSON.stringify(defaultReviews));
          setReviews(defaultReviews);
        }
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch reviews' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(r => 
    r.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.comment && r.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
    ));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Reviews & Ratings</h1>
        <p className="text-xs text-textSecondary">Monitor customer satisfaction and direct user feedback reviews.</p>
      </div>

      <Card>
        <Card.Content className="flex items-center gap-4 py-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search feedback reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-textPrimary focus:outline-none focus:border-primary"
            />
          </div>
        </Card.Content>
      </Card>

      {filteredReviews.length === 0 ? (
        <EmptyState title="No Reviews found" description="Customer reviews will appear here once rating links are distributed." />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredReviews.map((rev) => (
            <Card key={rev.id}>
              <Card.Content className="flex flex-col gap-3 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderStars(rev.rating)}
                  </div>
                  <span className="text-[10px] text-textSecondary">{rev.createdAt.substring(0, 10)}</span>
                </div>
                
                <p className="text-sm text-textPrimary leading-relaxed italic">"{rev.comment}"</p>
                
                <div className="flex items-center gap-2 text-xs text-textSecondary border-t border-border pt-2 mt-1">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span>Submitted by <strong>{rev.reviewerName}</strong></span>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
