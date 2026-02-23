class Api::V1::Current::NotesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    notes = filter_notes
    notes = notes.order(created_at: :desc).page(params[:page] || 1).per(params[:note_page] || 15)
    render json: notes, meta: pagination(notes), adapter: :json
  end

  def show
    note = current_user.notes.find(params[:id])
    render json: note
  end

  def create
    note = current_user.notes.create!(note_params)
    render json: note
  end

  def update
    note = current_user.notes.find(params[:id])
    note.update!(note_params)
    render json: note
  end

  def destroy
    note = current_user.notes.find(params[:id])
    note.destroy!
    head :no_content
  end

  private

    def filter_notes
      notes = current_user.notes.includes(:tags, :book)
      notes = notes.where("content LIKE ?", "%#{params[:q]}%") if params[:q].present?
      notes = notes.joins(:note_tags).where(note_tags: { tag_id: params[:tag_id] }) if params[:tag_id].present?
      notes = notes.where(book_id: params[:book_id]) if params[:book_id].present?
      notes
    end

    def note_params
      params.expect(note: [:content, :book_id, tag_ids: []])
    end
end
