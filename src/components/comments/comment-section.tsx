'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Reply, Flag, ChevronDown, ChevronUp, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { NoComments } from '@/components/shared/empty-states'
import type { Comment } from '@/types'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

interface CommentSectionProps {
  comments: Comment[]
}

export function CommentSection({ comments }: CommentSectionProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'top'>('newest')
  const [newComment, setNewComment] = useState('')
  const { isAuthenticated, user } = useAuth()

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return b.likes - a.likes
  })

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In production, this would send to API
      console.log('Submitting comment:', newComment)
      setNewComment('')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          Comments ({comments.length})
        </h2>
        <div className="flex gap-2">
          <Badge
            variant={sortBy === 'newest' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setSortBy('newest')}
          >
            Newest
          </Badge>
          <Badge
            variant={sortBy === 'top' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setSortBy('top')}
          >
            Top
          </Badge>
        </div>
      </div>

      {/* Comment Composer */}
      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        {isAuthenticated ? (
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 ">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 min-h-24 resize-none"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      {sortedComments.length > 0 ? (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <NoComments />
      )}
    </div>
  )
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const [isLiked, setIsLiked] = useState(comment.isLiked)
  const [likesCount, setLikesCount] = useState(comment.likes)
  const [showReplies, setShowReplies] = useState(true)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLike = () => {
    if (!isAuthenticated) return
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      console.log('Submitting reply:', replyText)
      setReplyText('')
      setIsReplying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-4', isReply && 'ml-12')}
    >
      <Avatar className="h-10 w-10 ">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-medium text-foreground">{comment.author.name}</span>
            {comment.author.isVerified && (
              <Badge variant="secondary" className="text-xs">Verified</Badge>
            )}
            <span className="text-sm text-muted-foreground" suppressHydrationWarning>
              {mounted ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-8 gap-1', isLiked && 'text-accent')}
            onClick={handleLike}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
            {likesCount}
          </Button>
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-4 w-4" />
              Reply
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-muted-foreground"
            onClick={() => toast({ title: 'Report submitted', description: 'We will review this comment.' })}
          >
            <Flag className="h-4 w-4" />
            Report
          </Button>
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="mb-2 min-h-20 resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>
                  Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="mb-3 h-8 gap-1 text-muted-foreground"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </Button>
            <AnimatePresence>
              {showReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
