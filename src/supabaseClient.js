import { createClient } from '@supabase/supabase-js'

// Thay URL và Key của bạn vào 2 dòng dưới
const supabaseUrl = 'https://adzmnxwkanhfbsptleqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkem1ueHdrYW5oZmJzcHRsZXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjI5MzIsImV4cCI6MjA4Mjk5ODkzMn0.f5D1_CixiBZtizUNNMdFaQnGNnPB8OaUOZqEw2nxDck'

export const supabase = createClient(supabaseUrl, supabaseKey)